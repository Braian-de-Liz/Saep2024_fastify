CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tarefas (
    id SERIAL PRIMARY KEY,
    id_usuario INTEGER NOT NULL,
    setor VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'a fazer',
    prioridade VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    criado_em DATE DEFAULT CURRENT_DATE,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);