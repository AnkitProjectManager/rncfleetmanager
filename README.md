# RNCFleets - Enterprise Endpoint Management Platform

RNCFleets is a comprehensive endpoint management and security platform designed for IT and security teams to manage, monitor, and secure devices across your organization.

## Features

### Device Management
- Multi-OS support (Windows, macOS, Linux, iOS, Android, ChromeOS)
- Real-time device inventory and status tracking
- Automated device enrollment and provisioning
- Device compliance monitoring

### Security & Compliance
- Security policy creation and enforcement
- Compliance monitoring and reporting
- Vulnerability scanning and management
- Incident response and remediation
- File integrity monitoring (FIM)
- YARA-based threat detection

### Software Management
- Software inventory tracking
- Patch management and deployment
- Vulnerability assessment
- License compliance

### Live Queries & Orchestration
- Execute osquery commands across your fleet
- Real-time system information gathering
- Automated remediation actions
- Query scheduling and automation

### Integrations
- SSO (Okta, Azure AD, Google Workspace)
- SIEM integration (Splunk, Datadog, New Relic)
- ITSM integration (ServiceNow, Jira)
- DevOps tools (GitHub, GitLab, Jenkins)
- Webhooks for custom integrations

### Administration
- Multi-tenant architecture
- Role-based access control (RBAC)
- Team management
- Audit logging
- API access and webhooks

## Getting Started

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open http://localhost:3000

### Demo Credentials

- Email: `demo@fleet.com`
- Password: `demo123`

## API Documentation

### Authentication

All API requests require a Bearer token in the Authorization header:

\`\`\`bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.fleet.local/api/devices
\`\`\`

### Endpoints

#### Devices

**List Devices**
\`\`\`bash
GET /api/devices
Authorization: Bearer YOUR_API_KEY
\`\`\`

**Enroll Device**
\`\`\`bash
POST /api/devices
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "hostname": "DESKTOP-001",
  "osType": "Windows",
  "osVersion": "11 Pro",
  "serialNumber": "SN123456"
}
\`\`\`

#### Policies

**List Policies**
\`\`\`bash
GET /api/policies
Authorization: Bearer YOUR_API_KEY
\`\`\`

**Create Policy**
\`\`\`bash
POST /api/policies
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "name": "Password Policy",
  "description": "Enforce strong passwords",
  "type": "security",
  "rules": [
    {
      "name": "Min Length",
      "value": 12
    }
  ]
}
\`\`\`

#### Incidents

**List Incidents**
\`\`\`bash
GET /api/incidents
Authorization: Bearer YOUR_API_KEY
\`\`\`

**Report Incident**
\`\`\`bash
POST /api/incidents
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "type": "malware",
  "severity": "critical",
  "description": "Suspicious process detected"
}
\`\`\`

#### Live Queries

**List Queries**
\`\`\`bash
GET /api/queries
Authorization: Bearer YOUR_API_KEY
\`\`\`

**Execute Query**
\`\`\`bash
POST /api/queries
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "query": "SELECT * FROM processes;",
  "targetDevices": ["dev-1", "dev-2"]
}
\`\`\`

### CLI Tool (rncfleetsctl)

The RNCFleets CLI tool allows you to manage your fleet from the command line.

### Installation

\`\`\`bash
npm install -g rncfleetsctl
\`\`\`

### Usage

\`\`\`bash
# Login
rncfleetsctl login --email demo@rncfleets.com --password demo123

# List devices
rncfleetsctl devices list

# Enroll device
rncfleetsctl devices enroll --hostname DESKTOP-001 --os-type Windows --os-version "11 Pro"

# List policies
rncfleetsctl policies list

# Create policy
rncfleetsctl policies create --name "Password Policy" --type security

# Execute query
rncfleetsctl query execute "SELECT * FROM processes;"

# List incidents
rncfleetsctl incidents list

# Get API key
rncfleetsctl config api-key
\`\`\`

## Architecture

### Multi-Tenant Design
- Isolated data per organization
- Shared infrastructure
- Organization-level settings and policies

### Security
- Role-based access control (RBAC)
- API key authentication
- Multi-factor authentication (MFA)
- Single Sign-On (SSO) support
- Audit logging

### Scalability
- Horizontal scaling support
- Database optimization
- Caching layer (Redis)
- Load balancing ready

## Database Schema

### Organizations
- id (UUID)
- name (string)
- settings (JSON)
- created_at (timestamp)

### Users
- id (UUID)
- email (string)
- org_id (UUID)
- role (enum: admin, manager, user, viewer)
- created_at (timestamp)

### Devices
- id (UUID)
- org_id (UUID)
- hostname (string)
- os_type (enum)
- os_version (string)
- enrollment_status (enum)
- compliance_status (enum)
- last_seen (timestamp)

### Policies
- id (UUID)
- org_id (UUID)
- name (string)
- type (enum)
- rules (JSON)
- enabled (boolean)
- created_at (timestamp)

### Incidents
- id (UUID)
- org_id (UUID)
- device_id (UUID)
- type (enum)
- severity (enum)
- status (enum)
- created_at (timestamp)

## Development

### Project Structure

\`\`\`
fleet/
├── app/
│   ├── api/              # API routes
│   ├── dashboard/        # Dashboard pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Login page
│   └── globals.css       # Global styles
├── components/
│   ├── ui/               # UI components
│   ├── sidebar.tsx       # Navigation sidebar
│   └── dashboard-*.tsx   # Dashboard components
├── lib/
│   ├── types.ts          # TypeScript types
│   ├── storage.ts        # Data storage utilities
│   └── utils.ts          # Utility functions
└── public/               # Static assets
\`\`\`

### Running Tests

\`\`\`bash
npm run test
\`\`\`

### Building for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For support, email support@rncfleets.local or visit https://rncfleets.local/support
