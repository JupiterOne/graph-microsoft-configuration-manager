# Development

## Prerequisites

- An Azure tenant to launch to the Microsoft Configuration Manager lab
  environment into

## Provider account setup

- [Follow the instructions to set-up a lab environment using Azure](https://learn.microsoft.com/en-us/mem/configmgr/core/get-started/azure-template)
  - Select "Configuration Manager current branch template." instead of the
    "technical preview template"
  - Select "Deploy to Azure"
  - In the Azure install manager:
    - Click "Create new" for the "Resource group" (ex. value `intcmdev`)
    - Prefix: `intcmdev` (name isn't important as long as it's clear)
    - Create an admin username and password (store these somewhere safe e.g.
      LastPass).

### Firewall Rules

In order to access the Microsoft Configuration Manager server from your local
development machine, you'll need to allow ingress to Microsoft SQL Server port
on the Azure VM.

- Navigate to the recently created Azure Resource Group
- Click on the `{SERVER_NAME}-cmps01` virtual machine record
- Click on the "Networking" header
- Click the "Add inbound port rule" button
- Create a firewall rule using the following settings:
  - Source: "My IP address"
  - Source port ranges: `*`
  - Destination: "Any"
  - Service: "MS SQL"
  - Click the "Add" button to create the firewall rule

### Remote Desktop

After the lab environment has been successfully provisioned, you'll need to
install the Microsoft Remote Desktop client and download the VM's remote desktop
connection file (RDP).

- [Installing Microsoft Remote Desktop on macOS](https://apps.apple.com/us/app/microsoft-remote-desktop/id1295203466)

To download the VM's remote desktop connection file:

- Navigate to the recently created Azure Resource Group
- Click on the `{SERVER_NAME}-cmps01` virtual machine record
- Click the "Connect" button at the top of the page
- Select "RDP" (should be the default) and use the following settings
  - IP Address: "Public IP address (...)"
  - Port number: 3389
  - Click "Download RDP File"

Once the client is installed and the RDP file has been downloaded, you may open
the RDP application file and login with the administrator user:

- Username: `contoso\{USERNAME_CREATED}`
- Password: _PASSWORD CREATED_

**NOTE**: The `contoso\` prefix is the default assigned domain and is a
necessary prefix for authentication.

### Adding an SQL User

- Remote desktop inside of the VM and login with the administrator user
- Open Microsoft SQL Server Management Studio
- Connect to the server using the following settings:
  - Server type: Database Engine
  - Server name: "{SERVER_NAME}-cmps01"
  - Authentication: Windows Authentication
  - User name: `contoso\DEFAULT_USER_HERE`
  - Password: _LEAVE EMPTY_
- In the object explorer, open the "Security" folder.
- Right-click on "Logins" and select "New Login..."
- Create a user using the following steps:
  - Login name: `j1int`
  - Select "SQL Server Authentication"
  - Create a password
  - Default database: `CM_PS1`
  - Navigate to the "User Mapping" page
  - Check the "Map" box for the `CM_PS1` database row
  - Ensure that both `public` and `db_datareader` are checked under "Database
    role membership for: CM_PS1"
  - Click "OK"

## Authentication

In order to authenticate, the last item that you'll need is the `HOST`. Now that
we've added a firewall rule that allows ingress to port 1433 on the VM, the
`HOST` value should be assigned the public IP address of the VM. You can obtain
the public IP address by:

- Navigate to the recently created Azure Resource Group
- Click on the `{SERVER_NAME}-cmps01-ip` record
- Copy the "IP address" value and assign `HOST` in `.env` to that value

```
HOST="20.1.1.1"
DATABASE="CM_PS1"
USERNAME="j1int"
PASSWORD="thepassword"
```
