# **🏡 Dieti Estates 25**

## 📌 Introduzione  
**DietiEstates25** è una piattaforma web-based per la gestione e la compravendita di immobili, progettata per offrire un’interfaccia intuitiva sia per gli utenti alla ricerca di immobili che per gli agenti immobiliari e gli amministratori del sistema.

### **🔹 Funzionalità Principali**
✔ **Ricerca avanzata di immobili** con filtri personalizzati (prezzo, località, caratteristiche, ecc.).  
✔ **Salvataggio di annunci tra i preferiti** per un accesso rapido.  
✔ **Sistema di messaggistica** tra utenti e agenti.  
✔ **Gestione delle offerte immobiliari** in modo trasparente e sicuro.  
✔ **Dashboard per agenti e amministratori** con strumenti di gestione avanzata.  

---

## **🛠 Tecnologie Utilizzate**
Il progetto è stato sviluppato utilizzando lo **stack PERN** (_PostgreSQL, Express.js, React.js, Node.js_), con un'architettura **monolitica** eseguita su **AWS EC2** e con persistenza dei dati su **AWS RDS**.

### **📌 Tecnologie principali**
- **Frontend:** [React.js](https://react.dev/) con gestione dello stato, componenti modulari e SCSS per lo stile.  
- **Backend:** [Node.js](https://nodejs.org/) con [Express.js](https://expressjs.com/) per la gestione delle API REST.  
- **Database:** [PostgreSQL](https://www.postgresql.org/) gestito su **AWS RDS**.  
- **Storage:** [AWS S3](https://aws.amazon.com/s3/) per l’archiviazione delle immagini delle inserzioni.  
- **Autenticazione:** **JWT** con **OAuth (Google Login)** e autenticazione tradizionale con password hashata.  
- **Containerizzazione:** [Docker](https://www.docker.com/) per la gestione e il deploy dei servizi.  
- **Analisi della Qualità del Codice:** [SonarQube](https://www.sonarqube.org/) per garantire alta qualità e sicurezza del codice.  

---

## **📌 Architettura del Progetto**
L’applicazione segue un’architettura **monolitica strutturata**, con separazione logica tra i vari livelli.

### **🔹 Backend**
L'architettura del backend è organizzata nel seguente modo:

- **Routes** → Definiscono le API esposte dal backend.  
- **Middleware** _(opzionale)_ → Gestisce autenticazione, validazione e logging.  
- **Controller** → Contiene la logica applicativa e richiama le repository.  
- **Repository** → Interagisce direttamente con il database tramite **PostgreSQL**.  
- **Models** → Definiscono le entità del database.  

📌 **Schema di flusso delle richieste**:  
```mermaid
graph TD;
  User -->|Richiesta| Routes;
  Routes -->|Middleware opzionale| Middleware;
  Middleware -->|Elaborazione| Controller;
  Controller -->|Interazione DB| Repository;
  Repository -->|Lettura/Scrittura| PostgreSQL;


## **📌 Frontend**
Il frontend è sviluppato in **React.js**, con un’architettura component-based, utilizzando:

- ✔ **SCSS** per la gestione avanzata degli stili.
- ✔ **React Router** per la navigazione tra pagine.
- ✔ **Axios** per la comunicazione con il backend.

