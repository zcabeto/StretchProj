#!/bin/bash
#Wrote this script to avoid manually intialising all the dockers and loading the data in the db

echo "Starting script..."

#cd to setup dir to access python script
cd setup/"$(dirname "$0")"

# If not done, clean data to prepare for DB
if ! test -f ../data/cleaned_movies.csv; then 
    echo "Running Python preprocessing script..."; 
    python cleaning.py; 
else 
    echo "Data already processed..."; 
fi

# If DB not running, start DB containers
if ! test "$(docker ps -a | grep mysql_container)"; then
    echo "Starting DB Container";
    docker-compose up -d;

    echo "Waiting for MySQL to be ready...";
    while ! docker exec mysql_container mysqladmin --user=root --password=your_root_password ping --silent &> /dev/null ; do
        echo "Waiting for database connection...";
        sleep 2;
    done

    # Copy cleaned CSV files into the MySQL container
    echo "Copying CSV files into the MySQL container...";
    docker cp ../data/. mysql_container:/var/lib/mysql-files/;

    # Execute SQL scripts to initialize the database
    echo "Executing SQL scripts...";
    docker exec -i mysql_container mysql -u root -pyour_root_password < init.sql;
fi

if [ -z "$(docker network ls --filter name='network' --format '{{.Name}}')" ]; then
    echo "Creating the network...";
    docker network create network;
else echo "Network already exists";
fi

# Building and running the Docker container for frontend
if ! test "$(docker ps -a | grep app-cont)"; then
    echo "Building and running Docker container for frontend...";
    cd ../app2;
    docker build -t db-app .;
    docker run -p 3000:3000 -d --name app-cont db-app;
fi

# Connect app-cont container to the network
if ! docker network inspect network | grep -q "\"Name\": \"app-cont\""; then
    echo "Connecting app-cont to the network...";
    docker network connect network app-cont;
else echo "app-cont already on the network";
fi

# Connect SQL container to same network so they are linked
if ! docker network inspect network | grep -q "\"Name\": \"mysql_container\""; then
    echo "Connecting mysql_container to the network..."
    docker network connect network mysql_container
else echo "mysql_container already on the network";
fi

#Setup should be completed and page ready to view at localhost:3000
echo "Setup completed."
