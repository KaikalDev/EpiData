@echo off
echo === SETUP DO PROJETO (Front + Back) ===

:: FRONTEND
echo [1/2] Instalando dependencias do FRONT...
cd frontEnd
call npm install
cd ..

:: BACKEND
echo [2/2] Configurando BACK...
cd backEnd\api

:: se não existir venv, cria
if not exist venv (
    echo Criando venv...
    python -m venv venv
)

:: ativa venv e instala requirements
call venv\Scripts\activate
echo Instalando dependencias do BACK...
pip install --upgrade pip
pip install -r requirements.txt
deactivate
cd ..\..

echo === SETUP CONCLUIDO COM SUCESSO ===
pause
