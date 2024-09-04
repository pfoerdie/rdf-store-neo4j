MERGE (subject:NamedNode {value: $subject.value})
MERGE (predicate:NamedNode {value: $predicate.value})
MERGE (object:NamedNode {value: $object.value})
MERGE (graph:NamedNode {value: $graph.value})

MERGE (quad:Quad)
WHERE (quad)-[:subject]->(subject),
      (quad)-[:predicate]->(predicate),
      (quad)-[:object]->(object),
      (quad)-[:graph]->(graph)