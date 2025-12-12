import { sharedZepClient } from "@/lib/clients/zep";

export async function listNotes() {
  return sharedZepClient.fetchNotes();
}
