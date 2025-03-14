describe('Central de Atendimento ao Cliente TAT', () => {
  beforeEach(() => {
    cy.visit('./src/index.html')
  });
  it('verifica o título da aplicação', () => {
    cy.title().should('eq','Central de Atendimento ao Cliente TAT')
  })
  Cypress._.times(3, () =>{
    it('preenche os campos obrigatórios e envia o formulário', () => {
      cy.get('#firstName').type('Álvaro')
      cy.get('#lastName').type('Henrique')
      cy.get('#email').type('teste@teste.com.br')
      cy.get('#open-text-area').type('Excelente aplicação!!!.',{delay:0})
      cy.contains('button','Enviar').click()
      cy.get('[class="success"]').should('be.visible')
    });
  })
  it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    cy.clock()
    cy.get('#firstName').type('Álvaro')
    cy.get('#lastName').type('Henrique')
    cy.get('#email').type('teste')
    cy.get('#open-text-area').type('Excelente aplicação!!!.')
    cy.contains('button','Enviar').click()
    cy.get('.error').should('be.visible')
    cy.tick(3000)
    cy.get('.error').should('not.be.visible')
  });
  it('verifica se o campo telefone não armazena valores não-numéricos', () => {
    cy.get('#phone').as('telefone').type('texto')
    cy.get('@telefone').should('not.have.value','texto')
  });
  it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', () => {
    cy.clock()
    cy.get('#firstName').type('Álvaro')
    cy.get('#lastName').type('Henrique')
    cy.get('#email').type('teste@teste.com.br')
    cy.get('#phone-checkbox').check()
    cy.get('#open-text-area').type('Excelente aplicação!!!.',{delay:0})
    cy.contains('button','Enviar').click()
    cy.get('.error').should('be.visible')
    cy.tick(3000)
    cy.get('.error').should('not.be.visible')
  });
  it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    cy.get('#firstName').as('nome').type('Álvaro').should('have.value', 'Álvaro')
    cy.get('@nome').clear().should('not.have.value', 'Álvaro')
    cy.get('#lastName').as('sobrenome').type('Henrique').should('have.value', 'Henrique')
    cy.get('@sobrenome').clear().should('not.have.value', 'Henrique')
    cy.get('#email').as('e-mail').type('teste@teste.com.br').should('have.value', 'teste@teste.com.br')
    cy.get('@e-mail').clear().should('not.have.value', 'teste@teste.com.br')
    cy.get('#phone').as('telefone').type('99999').should('have.value', '99999')
    cy.get('@telefone').clear().should('not.have.value','99999')
  });
  it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.clock()
    cy.contains('button','Enviar').click()
    cy.get('.error').should('be.visible')
    cy.tick(3000)
    cy.get('.error').should('not.be.visible')
  });
  it('envia o formuário com sucesso usando um comando customizado', () => {
    cy.fillMandatoryFieldsAndSubmit()
  });
  it('seleciona um produto (YouTube) por seu texto', () => {
    cy.get('#firstName').type('Álvaro')
    cy.get('#lastName').type('Henrique')
    cy.get('#email').type('teste@teste.com.br')
    cy.get('#open-text-area').type('Excelente aplicação!!!.',{delay:0})
    cy.get('#product')
      .as('produto')
      .select('YouTube')
    cy.get('@produto').should('have.value', 'youtube')
    cy.contains('button','Enviar').click()
});
  it('seleciona um produto (Mentoria) por seu valor (value)', () => {
    cy.get('#firstName').type('Álvaro')
    cy.get('#lastName').type('Henrique')
    cy.get('#email').type('teste@teste.com.br')
    cy.get('#open-text-area').type('Excelente aplicação!!!.',{delay:0})
    cy.get('#product')
      .as('produto')
      .select('mentoria')
    cy.get('@produto').should('have.value', 'mentoria')
    cy.contains('button','Enviar').click()
  });
  it('seleciona um produto (Blog) por seu índice', () => {
    cy.get('#firstName').type('Álvaro')
    cy.get('#lastName').type('Henrique')
    cy.get('#email').type('teste@teste.com.br')
    cy.get('#open-text-area').type('Excelente aplicação!!!.',{delay:0})
    cy.get('#product')
      .as('produto')
      .select(1)
    cy.get('@produto').should('have.value', 'blog')
    cy.contains('button','Enviar').click()
  });
  it('marca o tipo de atendimento "Feedback', () => {
    cy.get('input[value=feedback]')
    .as('Feedback_Select')
    .check()
    cy.get('@Feedback_Select').should('be.checked')
  });
  it('marca cada tipo de atendimento', () => {
    cy.get('input[name=atendimento-tat]')
    .each(($el, index, $list) => {
        cy.wrap($el).check()
        cy.wrap($el).should('be.checked')
    })
  });
  it('marca ambos checkboxes, depois desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .as('checkboxs')
      .check()
    cy.get('@checkboxs').should('be.checked')
    cy.get('@checkboxs')
      .last()
      .uncheck()
      cy.get('@checkboxs')
      .last()
      .should('not.to.be.checked')
  });
  it('seleciona um arquivo da pasta fixtures', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json')
      .should(input =>{
          expect(input[0].files[0].name).to.equal('example.json')
      })
  });
  it('seleciona um arquivo simulando um drag-and-drop', () => {
    cy.get('#file-upload')
      .selectFile('cypress/fixtures/example.json', {action: 'drag-drop'})
      .should(input =>{
          expect(input[0].files[0].name).to.equal('example.json')
      })
  });
  it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
    cy.fixture('example.json', null).as('myFixture')
    cy.get('#file-upload')
      .selectFile('@myFixture', {action: 'drag-drop'})
      .should(input =>{
          expect(input[0].files[0].name).to.equal('example.json')
      })
  });
  it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
    cy.contains('a','Política de Privacidade').should('have.attr','target','_blank')
  });
  it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('a[href="privacy.html"]')
      .invoke('removeAttr', 'target')
      .click()
    cy.title().should('eq','Central de Atendimento ao Cliente TAT - Política de Privacidade')
  });
  it('testa a página da política de privacidade de forma independente', () => {
    cy.visit('src/privacy.html')
    cy.title().should('eq','Central de Atendimento ao Cliente TAT - Política de Privacidade')
  });
  it('exibe e oculta as mensagens de sucesso e erro usando .invoke()', () => {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
  });
  it('preenche o campo da área de texto usando o comando invoke', () => {
    cy.get('#firstName').invoke('val','Álvaro')
    cy.get('#lastName').invoke('val','Henrique')
    cy.get('#email').invoke('val','teste@teste.com.br')
    cy.get('#open-text-area')
      .invoke('val','Excelente aplicação!!!.',{delay:0})
      .should('have.value', 'Excelente aplicação!!!.')
    cy.contains('button','Enviar').click()
    cy.get('[class="success"]').should('be.visible')
  });
  it('faz uma requisição HTTP', () =>{
    cy.request({
      method: 'GET',
      url: 'https://cac-tat-v3.s3.eu-central-1.amazonaws.com/index.html'
    }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.statusText).to.equal('OK')
      expect(response.body).to.contain('CAC TAT')
    })
  });
/*   it('encontra o gato escondido', () => {
    cy.get('span[id="cat"]')
      .invoke('show')
      .should('be.visible')
  }); */
})