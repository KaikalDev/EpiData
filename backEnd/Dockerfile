# Python 3.12 slim
FROM python:3.12-slim

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os requirements do backend
COPY api/requirements.txt .

# Instala dependências
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copia todo o backend (incluindo a pasta api)
COPY api/ ./api

# Expõe a porta (Render usa $PORT)
EXPOSE 5000

# Comando para rodar a API
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "5000"]

