CREATE DATABASE "dbtests";

\c "dbtests";

CREATE TABLE "Products" (
    "Id" serial PRIMARY KEY,
    "Name" varchar(100) NOT NULL,
    "Upc" varchar(30) NOT NULL
);