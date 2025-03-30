import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  arrayRemove
} from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { Link } from "react-router-dom";
import "../styles/main.css";

const InventoriesPage = () => {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInventories = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "inventories"),
        where("collaborators", "array-contains", auth.currentUser.uid),
        orderBy("updatedAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const inventoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        itemCount: doc.data().items?.length || 0 // Novo campo adicionado
      }));

      setInventories(inventoriesData);
      setError("");
    } catch (error) {
      setError("Erro ao carregar inventários");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (inventoryId, ownerId) => {
    try {
      if (auth.currentUser.uid !== ownerId) {
        alert("Apenas o dono pode excluir este inventário!");
        return;
      }

      if (!window.confirm("Tem certeza que deseja excluir permanentemente este inventário?")) return;

      await deleteDoc(doc(db, "inventories", inventoryId));
      setInventories((prev) => prev.filter((item) => item.id !== inventoryId));
      alert("Inventário excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir:", error);
      alert("Erro ao excluir inventário");
    }
  };

  // Nova função para sair do inventário
  const handleLeave = async (inventoryId) => {
    try {
      if (!window.confirm("Tem certeza que deseja sair deste inventário?")) return;
      
      await updateDoc(doc(db, "inventories", inventoryId), {
        collaborators: arrayRemove(auth.currentUser.uid)
      });
      
      setInventories((prev) => prev.filter((item) => item.id !== inventoryId));
      alert("Você saiu do inventário com sucesso!");
    } catch (error) {
      console.error("Erro ao sair:", error);
      alert("Erro ao sair do inventário");
    }
  };

  useEffect(() => {
    if (auth.currentUser) fetchInventories();
  }, []);

  if (loading) return <div className="loading"><img src="https://edassets.org/static/img/svg/EDLoader1.svg" alt="" />Carregando...</div>;
  if (error) return <div className="error">❌ {error}</div>;

  return (
    <div className="inventories-page">
      <div className="header-controls">
        <h1>📚 Meus Inventários</h1>
        <div className="inventories-functions">
          <button
            onClick={fetchInventories}
            className="reload-btn"
            disabled={loading}
          >
            🔄 {loading ? "Carregando..." : "Recarregar Inventário"}
          </button>
          <Link to="/inventory/new" className="create-btn">
            ➕ Novo Inventário
          </Link>
        </div>
      </div>

      <div className="inventories-grid">
        {inventories.map((inventory) => (
          <div key={inventory.id} className="inventory-card">
            <div className="card-header">
              <h3>{inventory.name || "Inventário Sem Nome"}</h3>
              <div className="card-actions">
                {auth.currentUser?.uid === inventory.owner ? (
                  <button
                    onClick={() => handleDelete(inventory.id, inventory.owner)}
                    className="delete-btn"
                    title="Excluir inventário"
                  >
                    🗑️
                  </button>
                ) : (
                  <button
                    onClick={() => handleLeave(inventory.id)}
                    className="leave-btn"
                    title="Sair do inventário"
                  >
                    Sair
                  </button>
                )}
              </div>
            </div>
            <Link to={`/inventory/${inventory.id}`} className="inventory-link">
              <div className="meta-info">
                <span>
                  🕒 Criado em: {inventory.createdAt?.toLocaleDateString()}
                </span>
                <span>
                  ✏️ Última atualização: {inventory.updatedAt?.toLocaleDateString()}
                </span>
                {/* Nova linha adicionada */}
                <span>📦 Itens: {inventory.itemCount}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoriesPage;