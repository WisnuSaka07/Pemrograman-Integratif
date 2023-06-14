# Start zookeeper

```sh
.\zookeeper-server-start.bat ..\..\config\zookeeper.properties
```

# Start kafka server

```sh
.\kafka-server-start.bat ..\..\config\server.properties
```

# Create topic

```sh
kafka-topics.bat --create --bootstrap-server localhost:9092 --replication-factor 1 --partitions 1 --topic mytopic
```

# Start broker

```sh
kafka-console-producer.bat --broker-list localhost:9092 --topic mytopic
```

# Check received messages

```sh
kafka-console-consumer.bat --bootstrap-server localhost:9092 --topic mytopic --from-beginning
```

# Run test

![Screenshot (110)](https://github.com/reyhanqb/pemrograman-integratif/assets/107137535/5b9a8b9d-5958-45d0-ae08-6bb4f665ae2d)
