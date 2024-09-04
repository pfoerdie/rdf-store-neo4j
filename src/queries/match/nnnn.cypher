MATCH (quad:Quad)

MATCH (quad)-[:subject]->(subject:NamedNode {value: $subject.value})
MATCH (quad)-[:predicate]->(predicate:NamedNode {value: $predicate.value})
MATCH (quad)-[:object]->(object:NamedNode {value: $object.value})
MATCH (quad)-[:graph]->(graph:NamedNode {value: $graph.value})

WITH

CASE labels(subject)
  WHEN ["NamedNode"] THEN {termType: "NamedNode", value: subject.value}
  ELSE NULL
END AS subject

CASE labels(predicate)
  WHEN ["NamedNode"] THEN {termType: "NamedNode", value: predicate.value}
  ELSE NULL
END AS predicate

CASE labels(object)
  WHEN ["NamedNode"] THEN {termType: "NamedNode", value: object.value}
  ELSE NULL
END AS object

CASE labels(graph)
  WHEN ["NamedNode"] THEN {termType: "NamedNode", value: graph.value}
  ELSE NULL
END AS graph

return {subject, predicate, object, graph} AS quad