"""
Train FastText model on the generated skills corpus (Project Matcher).
"""

import os
from gensim.models import FastText

def train():
    corpus_path = "dataset/skills_corpus.txt"

    if not os.path.exists(corpus_path):
        print("Corpus not found. Generating dataset first...")
        from generate_dataset import main as generate
        generate()

    print("Loading training corpus...")
    sentences = []
    with open(corpus_path, "r") as f:
        for line in f:
            tokens = line.strip().split()
            if tokens:
                sentences.append(tokens)

    print(f"Loaded {len(sentences)} sentences")

    # Train FastText model
    print("Training FastText model...")
    model = FastText(
        sentences=sentences,
        vector_size=100,      # Embedding dimension
        window=5,             # Context window size
        min_count=1,          # Include all words (important for rare skills)
        workers=4,            # Parallel threads
        sg=1,                 # Skip-gram (better for small datasets)
        epochs=30,            # Number of training epochs
        min_n=2,              # Min character n-gram length (subword)
        max_n=5,              # Max character n-gram length (subword)
        seed=43               # Different seed from team recommender
    )

    # Save model
    os.makedirs("model", exist_ok=True)
    model_path = "model/fasttext_skills.model"
    model.save(model_path)

    print(f"\nModel trained and saved to {model_path}")
    print(f"Vocabulary size: {len(model.wv.key_to_index)}")

    # Quick test - show similar skills
    test_words = ["react", "python", "docker", "mysql", "flutter"]
    print("\nSimilarity tests:")
    for word in test_words:
        try:
            similar = model.wv.most_similar(word, topn=5)
            print(f"  {word}: {[(w, round(s, 3)) for w, s in similar]}")
        except KeyError:
            print(f"  {word}: (not in vocabulary, but FastText can still compute vectors)")

    # Test unseen words
    print("\nUnseen word tests (FastText subword magic):")
    unseen_pairs = [
        ("react", "reactjs"),
        ("python", "pythonic"),
        ("docker", "dockerize"),
        ("kubernetes", "k8s"),
    ]
    for w1, w2 in unseen_pairs:
        try:
            sim = model.wv.similarity(w1, w2)
            print(f"  similarity({w1}, {w2}) = {sim:.3f}")
        except:
            print(f"  Could not compute similarity for ({w1}, {w2})")


if __name__ == "__main__":
    train()
