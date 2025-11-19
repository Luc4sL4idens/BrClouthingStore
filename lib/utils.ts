/**
 * Valida um CPF brasileiro
 * @param cpf - CPF a ser validado (com ou sem formatação)
 * @returns true se o CPF for válido
 */
export function validarCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/[^\d]/g, '')

  // Verifica se tem 11 dígitos
  if (cpf.length !== 11) return false

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cpf)) return false

  // Validação do primeiro dígito verificador
  let soma = 0
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i)
  }
  let resto = 11 - (soma % 11)
  let digitoVerificador1 = resto === 10 || resto === 11 ? 0 : resto

  if (digitoVerificador1 !== parseInt(cpf.charAt(9))) return false

  // Validação do segundo dígito verificador
  soma = 0
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i)
  }
  resto = 11 - (soma % 11)
  let digitoVerificador2 = resto === 10 || resto === 11 ? 0 : resto

  return digitoVerificador2 === parseInt(cpf.charAt(10))
}

/**
 * Formata um CPF para o padrão XXX.XXX.XXX-XX
 * @param cpf - CPF sem formatação
 * @returns CPF formatado
 */
export function formatarCPF(cpf: string): string {
  cpf = cpf.replace(/[^\d]/g, '')
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

/**
 * Formata um valor monetário para o padrão brasileiro
 * @param valor - Valor numérico
 * @returns Valor formatado em R$
 */
export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor)
}

/**
 * Gera uma chave PIX aleatória (simulada)
 * @returns Chave PIX no formato de email
 */
export function gerarChavePIX(): string {
  return `pagamento${Date.now()}@brclouthingstore.com.br`
}
