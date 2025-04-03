// deploy-dist.cjs
const { execSync } = require("child_process");

try {
  const branchDeploy = "deploy";
  const mensagemCommit = "Deploy automático: arquivos da build";

  // Passo 1: Criar/alternar para a branch de deploy
  execSync(`git checkout ${branchDeploy} 2>nul || git checkout --orphan ${branchDeploy}`, { 
    stdio: "inherit",
    shell: "cmd.exe" // Força o uso do CMD do Windows
  });

  // Passo 2: Limpar a branch (exceto .git)
  execSync("git rm -rf .", { stdio: "inherit", shell: "cmd.exe" });

  // Passo 3: Copiar conteúdo da pasta dist para a raiz
  execSync("cp -r dist/* . /E /I /Y dist\\* .", { stdio: "inherit", shell: "cmd.exe" });

  // Passo 4: Remover a pasta dist (opcional)
  execSync("rmdir /s /q dist", { stdio: "inherit", shell: "cmd.exe" });

  // Passo 5: Commitar e enviar
  execSync("git add -A", { stdio: "inherit", shell: "cmd.exe" });
  execSync(`git commit -m "${mensagemCommit}"`, { stdio: "inherit", shell: "cmd.exe" });
  execSync(`git push origin ${branchDeploy} --force`, { stdio: "inherit", shell: "cmd.exe" });

  console.log("✅ Arquivos de build commitados na raiz da branch deploy!");
} catch (error) {
  console.error("❌ Erro:", error.message);
  process.exit(1);
}