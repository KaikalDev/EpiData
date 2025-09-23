@echo off
echo === Iniciando FRONT e BACK ===

:: inicia o backend em uma janela
start cmd /k "cd backEnd && call api\venv\Scripts\activate && uvicorn api.main:app --reload --port 5000"

:: inicia o frontend em outra
start cmd /k "cd frontEnd && npm start"

echo === Tudo rodando ===
pause
