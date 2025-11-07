import { agenteDireitoAdm } from "./direitoAdministrativo";
import { agenteGuiaMetodos } from "./guiaMetodos";
import { agentePortugues } from "./portugues";
import { agenteRaciocinioLogico } from "./raciocinioLogico";
import { agenteSiriusOrientador } from "./siriusOrientador";
import type { AgentSpec } from "./types";

export const agentes: Record<string, AgentSpec> = {
  sirius: agenteSiriusOrientador,
  da: agenteDireitoAdm,
  portugues: agentePortugues,
  raciocinio: agenteRaciocinioLogico,
  "guia-metodos": agenteGuiaMetodos,
};

export type AgentId = keyof typeof agentes;
