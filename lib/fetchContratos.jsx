import { supabase } from "@/supabase/supabase"

export async function fetchContrato(ano) {
    const { data, error } = await supabase
      .from("Contratos_armários")
      .select("Contrato")
      .eq("Ano", ano)

      if (error) {
        console.error("Erro ao buscar armários: ", error)
      }

      return data
}

export async function salvarContrato(file, nomeArquivo) {
    try {
    const filePath = `Contratos/${nomeArquivo}`; // caminho dentro do bucket

    const { error: uploadError } = await supabase.storage
      .from("arquivos")
      .upload(filePath, file, { upsert: true });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from("arquivos").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    console.log("Arquivo salvo com sucesso:", publicUrl);
    return publicUrl;
  } catch (err) {
    console.error("Erro ao salvar arquivo:", err);
    return null;
  }
}

export async function atualizarURLContrato(ano, url) {
    const { data, error } = await supabase
      .from("Contratos_armários")
      .update([{ Contrato: url }])
      .eq("Ano", ano)

      if (error) {
        console.error("Erro ao atualizar a URL do contrato: ", error)
      }
}

export async function novoURLContrato(ano, url) {
    const { data, error } = await supabase
      .from("Contratos_armários")
      .insert([{ Contrato: url }])
      .eq("Ano", ano)

      if (error) {
        console.error("Erro ao atualizar a URL do contrato: ", error)
      }
}