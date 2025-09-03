# ---------- Base ----------
FROM python:3.11-slim AS base
WORKDIR /app


# ---------- Dev ----------
FROM base AS dev
RUN pip install --no-cache-dir fastapi "uvicorn[standard]" pydantic
COPY requirements.txt . 
RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; fi
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]


# ---------- Prod ----------
FROM base AS prod
RUN pip install --no-cache-dir fastapi "uvicorn[standard]" pydantic
COPY requirements.txt .
RUN if [ -f requirements.txt ]; then pip install --no-cache-dir -r requirements.txt; fi
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]