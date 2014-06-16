curl -XPUT 'http://localhost:9200/_river/river-mongodb-help_search_text/_meta' -d '{
  "type": "mongodb",
  "mongodb": {
    "db": "sibexplorer_dev",
    "collection": "help_search_text"
  },
  "index": {
    "name": "sibexplorer",
    "type": "help_search_text"
  }
}'