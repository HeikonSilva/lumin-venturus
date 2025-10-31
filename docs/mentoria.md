# Progresso da Mentoria

## Sessão 1

### Checklist de Ajustes

- [x] Múltiplos H1 na mesma página
  - Consolidado um único H1 por página para manter a hierarquia semântica.
- [x] Uso de `a` onde deveria ser `button`
  - Links convertidos para botões quando a ação não envolve navegação.
- [x] Uso inconsistente de ARIA Landmarks (ex.: modais)
  - Revisto o markup dos modais para expor landmarks apropriadas.
- [x] Uso inconsistente de ARIA Landmarks (ex.: falta de ARIA em botões de ação)
  - Adicionados `aria-label` e atributos de controle nos botões com ícones.
- [?] WCAG AA (contraste de cor com o background)
  - Há divergência entre a medição do monitor do projeto (3.2:1) e a checagem feita via https://atmos.style/contrast-checker (5.77:1); aguarda validação final.

### Evidências de Contraste

> ![Contrast Check](./images/mentoria/constrast-check.png)
>
> A checagem via [atmos.style](atmos.style/contrast-checker) retornou contraste 5.77:1, enquanto o monitor registrou 3.2:1. A conclusão definitiva depende de reconciliar as leituras e confirmar a configuração de ambos os testes.

### Outras Melhorias

- [x] Inconsistência de design nas páginas de autenticação
  - Layouts de login/register alinhados ao design-system.
- [x] Pequenas correções em relação aos estilos para os temas dark/light
  - Ajustes finos nos tokens para garantir paridade entre temas.

---

## Sessão 2

### Checklist de Ajustes

- [ ] Reorganizar as dependências do projeto.
  - O `@tailwindcss/cli` é uma dependência de desenvolvimento e não será incluída no bundle final.
- [ ] Adicionar biblioteca para servir os arquivos do site
  - Remover a dependência externa da extensão Live Server.
- [ ] Visualização dos outros meses no calendário
  - Limitação relevante atualmente tratada como bug.
- [ ] Notificação de "Fora do Prazo" para tarefas
  - Definir comportamento e canais de alerta.
- [ ] Atualização da documentação do projeto

### Evidências e Discussões

- Mentor confirmou que o contraste da paleta está dentro do recomendado; a leitura incorreta vinha da extensão, que apresentou imprecisão na conversão do padrão OKLCH para HEX.
- É permitido construir uma API própria em Node e integrar um banco de dados. A nota final considera apenas a integração com esses serviços; Docker também é aceito. As diretrizes seguem abertas por conta da abrangência da categoria.

### Observações Gerais

- Avaliar a migração para Vite (vanilla, MPA) garantindo compatibilidade com a estrutura atual antes da adoção definitiva.
- Considerar ferramentas adicionais de linting para complementar a formatação hoje feita com Prettier.

---

## Sessão 3

### Checklist de Ajustes

### Evidências e Discussões

### Observações Gerais

---

## Sessão 4 (Final)

### Checklist de Ajustes

### Evidências e Discussões

### Observações Gerais
