# AI Engine & Prompt Engineering Standards

## 1. Multi-Model Architecture
- AI services must route dynamically between LLM providers (Gemini, Claude, OpenAI, DeepSeek, Ollama).
- Fallback strategies must be configured for provider downtime or quota limits.

## 2. Vector Embeddings & RAG
- Use PostgreSQL `pgvector` extension for storing and searching high-dimensional embeddings.
- Vector search queries must include `tenant_id` filters to prevent cross-tenant memory leakage.

## 3. Prompt Versioning
- System prompts must be managed with versioning in database/AI repositories. Never embed unversioned system prompts inside controller code.
