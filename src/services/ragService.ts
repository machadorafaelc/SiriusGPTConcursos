// Serviço para processamento de PDFs e RAG (Retrieval Augmented Generation)

export interface Document {
  id: string;
  title: string;
  content: string;
  page: number;
  disciplina: string;
  uploadedAt: Date;
}

export interface Citation {
  title: string;
  url: string;
  page?: number;
  content: string;
}

// Mock implementation - em produção seria integrado com um serviço real de RAG
export class RAGService {
  private documents: Document[] = [];

  async uploadFile(file: File, disciplina: string): Promise<Document[]> {
    const isTxt = file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt");
    if (isTxt) {
      return this.uploadTXT(file, disciplina);
    }
    // default: trata como PDF (mock)
    return this.uploadPDF(file, disciplina);
  }

  private async readFileAsText(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  }

  async uploadTXT(file: File, disciplina: string): Promise<Document[]> {
    const content = await this.readFileAsText(file);
    // Fatiar por blocos duplos de quebra de linha como "pseudopáginas"
    const chunks = content.split(/\n\n+/).filter(Boolean);
    const limited = chunks.slice(0, 5); // limitar para mock
    const docs: Document[] = limited.map((chunk, idx) => ({
      id: `txt_${Date.now()}_${idx + 1}`,
      title: `${file.name}`,
      content: chunk.slice(0, 4000),
      page: idx + 1,
      disciplina,
      uploadedAt: new Date(),
    }));

    this.documents.push(...docs);
    return docs;
  }

  async uploadPDF(file: File, disciplina: string): Promise<Document[]> {
    // Simula upload e processamento do PDF
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockDocuments: Document[] = [
          {
            id: `doc_${Date.now()}_1`,
            title: file.name,
            content: `Conteúdo extraído da página 1 do arquivo ${file.name} relacionado a ${disciplina}. Este é um exemplo de conteúdo que seria extraído de um PDF real.`,
            page: 1,
            disciplina,
            uploadedAt: new Date(),
          },
          {
            id: `doc_${Date.now()}_2`,
            title: file.name,
            content: `Conteúdo extraído da página 2 do arquivo ${file.name} relacionado a ${disciplina}. Mais informações relevantes para estudos de concurso.`,
            page: 2,
            disciplina,
            uploadedAt: new Date(),
          },
        ];

        this.documents.push(...mockDocuments);
        resolve(mockDocuments);
      }, 2000); // Simula tempo de processamento
    });
  }

  async searchDocuments(query: string, disciplina?: string): Promise<Citation[]> {
    // Simula busca nos documentos
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredDocs = disciplina 
          ? this.documents.filter(doc => doc.disciplina === disciplina)
          : this.documents;

        const mockCitations: Citation[] = filteredDocs
          .filter(doc => 
            doc.content.toLowerCase().includes(query.toLowerCase()) ||
            doc.title.toLowerCase().includes(query.toLowerCase())
          )
          .map(doc => ({
            title: doc.title,
            url: `#document-${doc.id}`,
            page: doc.page,
            content: doc.content.substring(0, 200) + '...',
          }));

        resolve(mockCitations);
      }, 1000);
    });
  }

  getDocumentsByDisciplina(disciplina: string): Document[] {
    return this.documents.filter(doc => doc.disciplina === disciplina);
  }

  getAllDocuments(): Document[] {
    return [...this.documents];
  }

  deleteDocument(id: string): boolean {
    const index = this.documents.findIndex(doc => doc.id === id);
    if (index !== -1) {
      this.documents.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Instância singleton do serviço
export const ragService = new RAGService();
