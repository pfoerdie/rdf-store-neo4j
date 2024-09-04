MATCH (quad:Quad)

MATCH (quad)-[:subject]->(subject)
MATCH (quad)-[:predicate]->(predicate)
MATCH (quad)-[:object]->(object)
OPTIONAL MATCH (object)-[:datatype]->(datatype:NamedNode)
MATCH (quad)-[:graph]->(graph)

WITH

CASE labels(subject)
  WHEN ["NamedNode"] THEN {termType: "NamedNode", value: subject.value}
  WHEN ["BlankNode"] THEN {termType: "BlankNode", value: subject.value}
  ELSE NULL
END AS subject

CASE labels(predicate)
  WHEN ["NamedNode"] THEN {termType: "NamedNode", value: predicate.value}
  ELSE NULL
END AS predicate

CASE labels(object)
  WHEN ["NamedNode"] THEN {termType: "NamedNode", value: object.value}
  WHEN ["BlankNode"] THEN {termType: "BlankNode", value: object.value}
  WHEN ["Literal"] THEN CASE labels(datatype)
    WHEN ["NamedNode"] THEN {termType: "Literal", value: object.value, language: object.language, datatype: {termType: NamedNode, value: datatype.value}}
    ELSE NULL
  END
  ELSE NULL
END AS object

CASE labels(graph)
  WHEN ["DefaultGraph"] THEN {termType: "DefaultGraph"}
  WHEN ["NamedNode"] THEN {termType: "NamedNode", value: graph.value}
  ELSE NULL
END AS graph

return {subject, predicate, object, graph} AS quad