MERGE (subject:NamedNode {value: $subject.value})
MERGE (predicate:NamedNode {value: $predicate.value})
MERGE (object:Literal {value: $object.value, language: $object.language})
MERGE (object)-[:datatype]->(datatype:NamedNode {value: $object.datatype.value})
MERGE (graph:DefaultGraph)

MERGE (quad:Quad)
WHERE (quad)-[:subject]->(subject),
      (quad)-[:predicate]->(predicate),
      (quad)-[:object]->(object),
      (quad)-[:graph]->(graph)