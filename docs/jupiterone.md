# Microsoft Configuration Manager

## Integration Benefits

- Visualize your Microsoft Configuration Manager devices, device collections,
  and local users in the JupiterOne graph.
- Monitor changes to Microsoft Configuration Manager devices using JupiterOne
  alerts.

## How it Works

- JupiterOne periodically fetches devices, device collections, and local users
  from Microsoft Configuration Manager to update the graph.
- Write JupiterOne queries to review and monitor updates to the graph, or
  leverage existing queries.
- Configure alerts to take action when JupiterOne graph changes, or leverage
  existing alerts.

## Prerequisites

- JupiterOne uses a connection to the Microsoft SQL server that hosts data for
  Microsoft Configuration Manager to pull data.
- If you have the ability to log into the database, it is strongly recommended
  that a user create an account specifically for JupiterOne to use.
- At a minimum, login credentials for an account that includes `public` and
  `db_datareader` permissions will be needed.

## Support

If you need help with this integration, contact
[JupiterOne Support](https://support.jupiterone.io).

## How to Use This Integration

### In the Microsoft Configuration Manager SQL Database

1. In the object explorer, open the "Security" folder.
2. Right-click on "Logins" and select "New Login..."
3. Create a user using the following steps:

- Enter the login name `j1int`.
- Select "SQL Server Authentication".
- Create a password.
- Set the default database to your Microsoft Configuration Manager database
- Navigate to the "User Mapping" page.
- Check the "Map" box for the Microsoft Configuration Manager database row.
- Ensure that both `public` and `db_datareader` are checked under "Database role
  membership for: " the Microsoft Configuration Manager database.
- Click "OK".

### In JupiterOne

1. From the top-bar menu, select Integrations.
2. Scroll to, or search for, the Microsoft Configuration Manager (SCCM)
   integration tile and click it.
3. Click the New Instance button and configure the settings:

- Enter the Host for the Microsoft Configuration Manager database.
- Enter the Database name.
- Enter the login name for the account to be used for SQL data retrieval. (the
  suggested name is `j1int`).
- Enter the password for the account to be used for SQL data retrieval.
- Enter in a name and description for the integration instance.

4. Click the Create button to complete the integration.

<!-- {J1_DOCUMENTATION_MARKER_START} -->
<!--
********************************************************************************
NOTE: ALL OF THE FOLLOWING DOCUMENTATION IS GENERATED USING THE
"j1-integration document" COMMAND. DO NOT EDIT BY HAND! PLEASE SEE THE DEVELOPER
DOCUMENTATION FOR USAGE INFORMATION:

https://github.com/JupiterOne/sdk/blob/main/docs/integrations/development.md
********************************************************************************
-->

## Data Model

### Entities

The following entities are created:

| Resources         | Entity `_type`                                      | Entity `_class` |
| ----------------- | --------------------------------------------------- | --------------- |
| Account           | `microsoft_configuration_manager_account`           | `Account`       |
| Application       | `microsoft_configuration_manager_application`       | `Application`   |
| Device            | `microsoft_configuration_manager_device`            | `Device`        |
| Device Collection | `microsoft_configuration_manager_device_collection` | `Group`         |
| Local User        | `microsoft_configuration_manager_local_user`        | `User`          |

### Relationships

The following relationships are created:

| Source Entity `_type`                               | Relationship `_class` | Target Entity `_type`                         |
| --------------------------------------------------- | --------------------- | --------------------------------------------- |
| `microsoft_configuration_manager_account`           | **HAS**               | `microsoft_configuration_manager_device`      |
| `microsoft_configuration_manager_device_collection` | **HAS**               | `microsoft_configuration_manager_device`      |
| `microsoft_configuration_manager_device`            | **HAS**               | `microsoft_configuration_manager_local_user`  |
| `microsoft_configuration_manager_device`            | **INSTALLED**         | `microsoft_configuration_manager_application` |

<!--
********************************************************************************
END OF GENERATED DOCUMENTATION AFTER BELOW MARKER
********************************************************************************
-->
<!-- {J1_DOCUMENTATION_MARKER_END} -->
