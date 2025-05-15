# 🛠️ NestJS Config Server

A lightweight, Git-backed **centralized configuration service**, inspired by Spring Cloud Config, built using **NestJS**. It serves versioned configuration files (`.yml`, `.yaml`, `.properties`) over HTTP with support for:

- ✅ Raw config delivery (YAML/Properties)
- ✅ Git-based versioning and rollback
- ✅ Commit-based version retrieval
- ✅ YAML syntax validation
- ✅ Environment-based Git repo configuration

---

## 📦 Features

| Feature                          | Description                                                              |
| -------------------------------- | ------------------------------------------------------------------------ |
| 🗂️ Multi-format support          | Serve `.yml`, `.yaml`, and `.properties` configs                         |
| 📜 Raw content delivery          | Sends **unparsed** YAML/Properties as-is, preserving indentation         |
| 🕘 Git versioning                | Serve config from the **last committed version**, or any specific commit |
| ✅ YAML syntax validation        | Ensures only syntactically valid YAML is served                          |
| ⚙️ Configurable repo path        | Git repo location via `.env` (`CONFIG_REPO`)                             |
| 🔄 Dynamic profile-based routing | URLs follow `/config/:application/:profile` structure                    |
| 📎 Commit pinning                | Use `?commit=<hash>` to retrieve historical versions                     |

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/mohamedsamy911/nest-config-server.git
cd nest-config-server
npm install
```

### 2. Setup Your Config Repo

Create or clone a Git repo containing your config files (e.g. `user-service-dev.yml`, `inventory-service-prod.properties`).
<br />
If it's a local folder:

```bash
cd config-repo
git init
git add .
git commit -m "Initial commit"
```

Place this folder either at `./config-repo` or configure a custom path via `.env`.

### 3.Configure `.env`

Create a `.env` file in the root of the project:

```bash
# Optional - defaults to ./config-repo if not set
CONFIG_REPO=./config-repo
# Optional - default to 8888 if not set
PORT=8888
```

### 4.Run the Server

```bash
npm run start
```

The server runs at `http://localhost:8888` by default.

## 📡 API Usage

🔹 Get YAML Config

```http
GET /user-service/dev
```

- Returns `user-service-dev.yml` from the latest commit

- Content-Type: `text/yaml`

---

🔸 Get Properties Config

```http
GET /inventory-service/prod?format=properties
```

- Returns `inventory-service-prod.properties`
- Content-Type: `text/plain`



## 🔁 Retrieve From Specific Commit

```http
GET 
/user-service/dev?commit=<commit-hash>
```

- Returns config as it existed at the specified commit



## 📁 File Naming Convention

Use the format: `{application}-{profile}.{format}`

Examples:

```bash
user-service-dev.yml
inventory-service-prod.properties
application-common.yml
```

## 🛡️ Validation

- ✅ YAML files are validated for syntax before being returned

- ❌ .properties files are returned as-is (no validation)


## ✅ Example Structure

```bash
config-repo/
├── user-service-dev.yml
├── user-service-prod.yml
├── inventory-service-prod.properties
└── application-common.yml
```

## 🔧 Customization Ideas

- Add authentication/token-based access

- Add schema validation (e.g., using AJV for structured YAML)

- Support for default profiles like application.yml

- Support for Git tags (?tag=v1.0.0)

## 📄 License

MIT — free to use, extend, and contribute.

## 🤝 Contributing

Contributions are welcome! Feel free to submit pull requests or open issues.
