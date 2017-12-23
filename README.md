## Getting Started

```sh
git clone https://github.com/sudheera/gov-entities.git
cd gov-entities

gov-entities
    ├── LICENSE
    ├── newep
    ├── node-api
    │   ├── config.js
    │   ├── index.js
    │   ├── package.json
    │   ├── package-lock.json
    │   └── Schema.json
    ├── package.json
    ├── README.md
    ├── sample_data.sql
    └── web-ui
        ├── package.json
        ├── package-lock.json
        ├── public
        │   ├── favicon.ico
        │   ├── index.html
        │   └── manifest.json
        ├── src
        │   ├── components
        │   │   ├── App.js
        │   │   ├── App.test.js
        │   │   ├── EntityForm.js
        │   │   ├── EntityUpdateForm.js
        │   │   ├── MainOrgChartVis.js
        │   │   ├── Map.js
        │   │   ├── RelationshipSelector.js
        │   │   ├── Schema.json -> ../../../node-api/Schema.json
        │   │   └── util.js
        │   ├── index.css
        │   └── index.js
        └── yarn.lock
```


***


### MYSQL database
Create a database (gov_entities) and improt the sample data from "[```sample_data.sql```](https://github.com/sudheera/gov-entities/blob/master/sample_data.sql)" file
Update the database connection info. in [```node-api/config.js```](https://github.com/sudheera/gov-entities/blob/master/node-api/config.js) file



### API server

```sh
cd node-api
npm install
```
**To start the API server run,**
```sh
node index.js

or 

nodemon

or
./node_modules/forever/bin/forever index.js
```



### React Web Interface
```sh
cd web-ui
npm install
```

**To start the dev server for the react app run,**
```sh
npm start
```

**Now you should be able to access the web app at http://localhost:3000**

![get-1](https://user-images.githubusercontent.com/311631/34322313-c3a385c0-e849-11e7-9e2c-dbd051470b27.png)


***

## Current Architecture
The database is designed to track organization entity properties (name, address, type...), relationships between entities and changes for those over time.
To achieve this, each property is gived a separate table in the database (instead of being a table column).


_revision tracking is yet to be implemented_


### Database

![erd](https://user-images.githubusercontent.com/311631/34322346-799ba10a-e84a-11e7-80b2-4ba5acbcb227.png)

The structure for this is defined in the [```node-api/Schema.json```](https://github.com/sudheera/gov-entities/blob/master/node-api/Schema.json) file.



### Property table structure
* Naming convention ```entity_<property_name>```
* Should only contain 4 fields
  id, <property>, start, end

**Also there are two types of entity property tables,**
* Regular (name, address, type etc.)
* Entity relationship (parent/child and eny other that references another entity)

**A regular property table**
```sh
+-------+--------------+------+-----+---------------------+-------+
| Field | Type         | Null | Key | Default             | Extra |
+-------+--------------+------+-----+---------------------+-------+
| id    | int(11)      | NO   | PRI | NULL                |       |
| name  | varchar(256) | NO   |     | NULL                |       |
| start | datetime     | NO   | PRI | 2017-01-01 00:00:00 |       |
| end   | datetime     | YES  |     | NULL                |       |
+-------+--------------+------+-----+---------------------+-------+
```
```sql
CREATE TABLE `entity_name` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `start` datetime NOT NULL DEFAULT '2017-01-01 00:00:00',
  `end` datetime DEFAULT NULL,
  PRIMARY KEY (`id`,`start`),
  CONSTRAINT `fk_entity_name` FOREIGN KEY (`id`) REFERENCES `entity` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 
```

**A 'relationship' property table**
```sh
+--------+----------+------+-----+---------------------+-------+
| Field  | Type     | Null | Key | Default             | Extra |
+--------+----------+------+-----+---------------------+-------+
| id     | int(11)  | NO   | PRI | NULL                |       |
| parent | int(11)  | YES  | MUL | NULL                |       |
| start  | datetime | NO   | PRI | 2017-01-01 00:00:00 |       |
| end    | datetime | YES  |     | NULL                |       |
+--------+----------+------+-----+---------------------+-------+
```
```sql
CREATE TABLE `entity_parent` (
  `id` int(11) NOT NULL,
  `parent` int(11) DEFAULT NULL,
  `start` datetime NOT NULL DEFAULT '2017-01-01 00:00:00',
  `end` datetime DEFAULT NULL,
  PRIMARY KEY (`id`,`start`),
  KEY `fk_entity_rel_parent_entity_idx` (`parent`),
  CONSTRAINT `fk_entity_parent` FOREIGN KEY (`id`) REFERENCES `entity` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_entity_parent_entity` FOREIGN KEY (`parent`) REFERENCES `entity` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8
```



### Adding properties
To add a new property, you have to first create the property table in the database and then update the  [```node-api/Schema.json```](https://github.com/sudheera/gov-entities/blob/master/node-api/Schema.json) file.

```json
(Current Schema.json file)
{
    "name": "entity",
    "properties": [
        {
            "name": "name",
            "label": "Name",
            "type": "string",
            "sql_type": "VARCHAR(256)",
            "required": true
        },
        {
            "name": "parent",
            "label": "Parent",
            "type": "rel",
            "required": true
        },
        {
            "name": "financial",
            "label": "Financial",
            "type": "rel"
        },
        {
            "name": "geo_coordinates",
            "label": "Location Coordinates",
            "type": "string",
            "sql_type": "VARCHAR(256)"
        },
        {
            "name": "geo_area",
            "label": "Location Area",
            "type": "string",
            "sql_type": "TEXT"
        },
        {
            "name": "category",
            "label": "Categoty",
            "type": "string",
            "sql_type": "VARCHAR(64)",
            "required": false
        }
    ]
}
```



### Script for adding new properties
There's simple script in the root dir. for adding new propery tables.
```sh
./newep <name> <label> <type> <sql_type> [is_required]

e.g: to add 'name'

./newep name 'Entity Name' string 'VARCHAR(256)' yes


e.g: to add the relationship property, 'parent'

./newep parent 'Entity Parent' rel 'INT(11)' yes
```
**(leave the last arg. "yes" out to indicate 'not required')**



### Removing properties
To remove a property you need to drop the table and update the  [```node-api/Schema.json```](https://github.com/sudheera/gov-entities/blob/master/node-api/Schema.json) file.
Any property can be removed except for **name** and **parent**.

_Both node-api and web-up need to be restared/rebuilt after adding or removing properties._



***


## Build and Deploy
The web-up is created using the [create-react-app](https://github.com/facebookincubator/create-react-app). The build script provided will build and bundle the app with required dependencies for production deployment.

```sh
cd web-ui
npm run build
```

The API server is setup to server the react static bundle. See [```package.json```](https://github.com/sudheera/gov-entities/blob/master/package.json) file in the root dir.

From the root directory, run
```sh
npm start
```

This will start the API server + serve the react app.


### Heroku deployment
See [```package.json```](https://github.com/sudheera/gov-entities/blob/master/package.json) file and follow  the guide at https://devcenter.heroku.com/articles/getting-started-with-nodejs#introduction

Current (2017-12-24) version is deployed at: https://mysterious-lowlands-34300.herokuapp.com/

