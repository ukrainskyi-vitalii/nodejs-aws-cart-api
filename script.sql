CREATE TYPE cart_status AS ENUM ('OPEN', 'ORDERED');

CREATE TABLE carts (
    id UUID not null default uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    status cart_status NOT NULL
);

create extension if not exists "uuid-ossp";

CREATE TABLE cart_items (
    cart_id UUID REFERENCES carts(id),
    product_id UUID,
    count INTEGER,
    PRIMARY KEY (cart_id, product_id)
);

INSERT INTO carts (id, user_id, created_at, updated_at, status)
VALUES
    ('0d6bcc94-76f7-4a3b-bc21-78fef8fd1453', '1c0a0abf-36ae-4c04-a140-6d2bc1bf2ef7', '2023-07-01 10:00:00', '2023-07-01 10:00:00', 'OPEN');

INSERT INTO cart_items (cart_id, product_id, count)
VALUES
    ('0d6bcc94-76f7-4a3b-bc21-78fef8fd1453', '8db01ac5-8638-406c-82d2-e08432122a99', 2),
    ('0d6bcc94-76f7-4a3b-bc21-78fef8fd1453', '5e325752-380e-4c00-825d-7123b2698f8d', 3);
