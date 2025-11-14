import { useState, useEffect } from 'react'
import { Concurso, GPT } from '../lib/supabase'
import { concursosService } from '../services/concursosService'
import { useAuth } from '../contexts/AuthContext'

export function useConcursos() {
  const { user } = useAuth()
  const [concursos, setConcursos] = useState<Concurso[]>([])
  const [meusConcursos, setMeusConcursos] = useState<Concurso[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar todos os concursos
  useEffect(() => {
    loadConcursos()
  }, [])

  // Carregar concursos do usuário
  useEffect(() => {
    if (user) {
      loadMeusConcursos()
    } else {
      setMeusConcursos([])
    }
  }, [user])

  const loadConcursos = async () => {
    setLoading(true)
    const { data, error } = await concursosService.listConcursos()
    if (error) {
      setError(error)
    } else if (data) {
      setConcursos(data)
    }
    setLoading(false)
  }

  const loadMeusConcursos = async () => {
    if (!user) return

    const { data, error } = await concursosService.getUserConcursos(user.id)
    if (error) {
      setError(error)
    } else if (data) {
      setMeusConcursos(data)
    }
  }

  const hasAccess = (concursoId: string) => {
    return meusConcursos.some(c => c.id === concursoId)
  }

  const checkAccess = async (concursoId: string) => {
    if (!user) return false

    const { hasAccess: access } = await concursosService.hasAccess(user.id, concursoId)
    return access
  }

  return {
    concursos,
    meusConcursos,
    loading,
    error,
    hasAccess,
    checkAccess,
    reload: loadConcursos,
    reloadMeusConcursos: loadMeusConcursos
  }
}

export function useGPTs(concursoId: string | null) {
  const [gpts, setGPTs] = useState<GPT[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (concursoId) {
      loadGPTs()
    } else {
      setGPTs([])
      setLoading(false)
    }
  }, [concursoId])

  const loadGPTs = async () => {
    if (!concursoId) return

    setLoading(true)
    const { data, error } = await concursosService.getGPTsByConcurso(concursoId)
    if (error) {
      setError(error)
    } else if (data) {
      setGPTs(data)
    }
    setLoading(false)
  }

  return {
    gpts,
    loading,
    error,
    reload: loadGPTs
  }
}
