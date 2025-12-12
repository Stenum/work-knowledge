import { ZepClient } from "@/lib/clients/zep";

const zepClient = new ZepClient();

export async function listNotes() {
  return zepClient.fetchNotes();
}
