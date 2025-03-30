import React, { useEffect, useState } from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import ProgressBar from "./ProgressBar";
import "../styles/main.css";

// Função auxiliar para normalização
const normalizeMaterial = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/(^\w{1})|(\s+\w{1})/g, (letra) => letra.toUpperCase());
};

const InventoryTable = ({ inventoryId }) => {
  // Estados
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ material: "", quantidade: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Carregar dados do Firestore
  useEffect(() => {
    if (!inventoryId) return;

    const unsubscribe = onSnapshot(
      doc(db, "inventories", inventoryId),
      (doc) => {
        if (doc.exists()) {
          setItems(doc.data().items || []);
          setError("");
        } else {
          setError("Inventário não encontrado");
        }
        setLoading(false);
      },
      (error) => {
        setError("Erro ao carregar dados");
        console.error("Erro:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [inventoryId]);

  // Atualizar inventário no Firestore
  const updateInventory = async (updatedItems) => {
    try {
      await updateDoc(doc(db, "inventories", inventoryId), {
        items: updatedItems,
        updatedAt: new Date(),
      });
    } catch (error) {
      setError("Erro ao salvar alterações");
      console.error("Erro:", error);
    }
  };

  // Handlers genéricos
  const handleItemAction = async (action, itemId, value = null) => {
    const newItems = items.map(item => {
      if (item.id !== itemId) return item;
      
      switch(action) {
        case 'SUBTRACT':
          return { ...item, restante: Math.max(0, item.restante - value) };
        case 'RESET':
          return { ...item, restante: 0 };
        default:
          return item;
      }
    });
    
    await updateInventory(action === 'REMOVE' ? items.filter(i => i.id !== itemId) : newItems);
  };

  const handleAddItem = async () => {
    if (!newItem.material.trim() || !newItem.quantidade) {
      alert("Preencha todos os campos!");
      return;
    }

    try {
      const normalized = normalizeMaterial(newItem.material.trim());
      const quantity = Number(newItem.quantidade);
      
      const existingIndex = items.findIndex(
        item => normalizeMaterial(item.material) === normalized
      );

      const updatedItems = [...items];
      
      if (existingIndex > -1) {
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantidade: updatedItems[existingIndex].quantidade + quantity,
          restante: updatedItems[existingIndex].restante + quantity
        };
      } else {
        updatedItems.push({
          id: Date.now().toString(),
          material: newItem.material.trim(),
          quantidade: quantity,
          restante: quantity
        });
      }

      await updateInventory(updatedItems);
      setNewItem({ material: "", quantidade: "" });
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      alert("Erro ao adicionar item");
    }
  };

  // Cálculos do progresso
  const total = items.reduce((acc, item) => acc + item.quantidade, 0);
  const remaining = items.reduce((acc, item) => acc + item.restante, 0);
  const used = total - remaining;
  const progress = total > 0 ? (used / total) * 100 : 0;

  if (loading) return <div className="loading">Carregando inventário...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="inventory-container">
      {/* Seção de Progresso */}
      <div className="progress-section">
        <h3>Progresso do Trabalho</h3>
        <ProgressBar percentage={progress} />
        <div className="progress-stats">
          <div>
            <span className="stat-number">{used.toLocaleString()}</span>
            <span className="stat-label"> Usados</span>
          </div>
          <div>
            <span className="stat-number">{remaining.toLocaleString()}</span>
            <span className="stat-label"> Restantes</span>
          </div>
          <div>
            <span className="stat-number">{total.toLocaleString()}</span>
            <span className="stat-label"> Total</span>
          </div>
        </div>
      </div>

      {/* Tabela de Materiais */}
      <div className="table-container">
        <table className="materials-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>Total</th>
              <th>Atual</th>
              <th>Entrega</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.material}</td>
                <td>{item.quantidade}</td>
                <td>{item.restante}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max={item.restante}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value > 0) {
                          handleItemAction('SUBTRACT', item.id, value);
                          e.target.value = "";
                        }
                      }
                    }}
                  />
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => handleItemAction('RESET', item.id)}
                      className="reset-btn"
                    >
                      Zerar
                    </button>
                    <button
                      onClick={() => handleItemAction('REMOVE', item.id)}
                      className="remove-btn"
                    >
                      Remover
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Formulário de Adição */}
          <tfoot>
            <tr>
              <td colSpan="5">
                <div className="add-item-container">
                  <div className="add-item-row">
                    <input
                      type="text"
                      placeholder="Novo material"
                      value={newItem.material}
                      onChange={(e) => setNewItem({
                        ...newItem,
                        material: normalizeMaterial(e.target.value)
                      })}
                    />
                    <input
                      type="number"
                      placeholder="Qtd."
                      min="1"
                      value={newItem.quantidade}
                      onChange={(e) => setNewItem({
                        ...newItem,
                        quantidade: e.target.value
                      })}
                    />
                    <button onClick={handleAddItem} className="add-item-button">
                      ➕ Adicionar
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default InventoryTable;