from config import openai_client, get_supabase, EMBEDDING_MODEL, TOP_K_CHUNKS


async def get_embedding(text: str) -> list[float]:
    """Get OpenAI embedding for a text string."""
    response = await openai_client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text.replace("\n", " "),
    )
    return response.data[0].embedding


async def embed_and_store_chunks(chunks: list[dict]):
    """Embed each chunk and upsert into transcript_chunks table."""
    db = get_supabase()
    for i, chunk in enumerate(chunks):
        embedding = await get_embedding(chunk["content"])
        db.table("transcript_chunks").insert({
            **chunk,
            "chunk_index": i,
            "embedding": embedding,
        }).execute()


async def retrieve_context(
    student_id: str,
    topic: str,
    query: str,
    k: int = TOP_K_CHUNKS,
) -> list[dict]:
    """
    Vector similarity search scoped to a specific student + topic.
    Uses the match_chunks SQL function (pgvector <=> operator).
    """
    db = get_supabase()
    query_embedding = await get_embedding(query)

    result = db.rpc("match_chunks", {
        "query_embedding":  query_embedding,
        "match_student_id": student_id,
        "match_topic":      topic,
        "match_count":      k,
    }).execute()

    return result.data or []
