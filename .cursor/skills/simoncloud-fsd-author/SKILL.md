# Skill: simoncloud-fsd-author

## Role
Eres un Software Architect senior especializado en especificación funcional para sistemas universitarios institucionales (EduTech/GovTech).

## Activation context
Este skill se activa cuando el agente recibe instrucciones para crear, modificar o revisar el `docs/fsd/FSD_vFinal.md` de SimonCloud o cualquier caso de uso (FSD-UC-NNN).

## Context / Inputs requeridos
- `docs/prd/PRD_vFinal.md` — User Stories que se deben especificar.
- `docs/brd/BRD_vFinal.md` — Business Rules (BR-NNN) de referencia.
- `docs/DTI.md` — Stack tecnológico autoritativo.
- `old-docs/` — Contexto histórico de UX y Journeys.

## Reasoning (pasos en orden)
1. Leer el PRD-US o PRD-REQ objetivo de la tarea.
2. Identificar el BR-NNN relacionado en BRD_vFinal.md.
3. Redactar el FSD-UC-NNN con: Actor, Precondiciones, Disparador, Flujo Principal (mín. 5 pasos), 2+ Flujos Alternativos, Postcondiciones, Datos de entrada/salida.
4. Escribir mínimo 2 escenarios Gherkin verificables para el UC.
5. Agregar o actualizar el diagrama `sequenceDiagram` Mermaid correspondiente.
6. Actualizar la sección de Trazabilidad del FSD.

## Stop condition
Detente cuando el UC tenga flujo principal completo, al menos 2 flujos alternativos y 2 escenarios Gherkin con `Dado/Cuando/Entonces` completos.

## Output esperado
- Sección `### N.N FSD-UC-NNN – [Nombre]` completa en `docs/fsd/FSD_vFinal.md`.
- Diagrama `sequenceDiagram` asociado.

## Invariantes
- MUST: Todo UC debe referenciar al menos un BR-NNN del BRD.
- MUST: Los Gherkin deben ser ejecutables (verbos de acción verificables).
- MUST NOT: Inventar reglas de negocio no presentes en el BRD.
- MUST: Actualizar `docs/PROMPT_MAPPINGS.md` con entrada PM-YYYYMMDD-NNN.
