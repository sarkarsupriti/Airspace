describe('Login Module', () => {
    let APP_URL;
    let VALID_USERNAME;
    let VALID_PASSWORD;
    let INVALID_USERNAME;
    let INVALID_PASSWORD;

    beforeEach(() => {
        APP_URL = 'https://the-internet.herokuapp.com/login';
        VALID_USERNAME = 'tomsmith';
        VALID_PASSWORD = 'SuperSecretPassword!';
        INVALID_USERNAME = 'testUsername';
        INVALID_PASSWORD = 'testPassword';
    });
    
    context('Negative Cases', () => {
        it('should not log in with wrong username',()=>{
            cy.visit(APP_URL);
            cy.get("#username").type(INVALID_USERNAME);
            cy.get("#password").type(VALID_PASSWORD);
            cy.get('form').submit();
            cy.get('#flash').then(function(e){
                const errorMessage = e.text()
                const expectedText =' Your username is invalid!'
                expect(errorMessage).to.contain(expectedText);
            });
        });
    
        it('should not log in with wrong password',()=>{
            cy.visit(APP_URL);
            cy.get("#username").type(VALID_USERNAME);
            cy.get("#password").type(INVALID_PASSWORD);
            cy.get("form").submit();
            cy.get("#flash").then(function(e){
                const errorMessage = e.text()
                const expectedText =' Your password is invalid!'
                expect(errorMessage).to.contain(expectedText)
            });
        });
    
        it('should not log in with both wrong credentials',()=>{
            cy.visit(APP_URL);
            cy.get("#username").type(INVALID_USERNAME);
            cy.get("#password").type(INVALID_PASSWORD);
            cy.get("form").submit();
            cy.get("#flash").then(function(e){
                const errorMessage = e.text()
                const expectedText =' Your username is invalid!'
                expect(errorMessage).to.contain(expectedText)
            });
        });
    });

    context('Positive Cases', () => {
        context('Page Renders Properly', () => {
            it('should have the header text "Login Page" ',()=> {
                cy.visit(APP_URL);
                cy.get('#content').find('h2').then((a)=>{
                    const headerText = a.text();
                    const extectedText = 'Login Page';
                    cy.expect(headerText).to.contains(extectedText);
                });
            });
        
            it('should have proper subHeader text',()=>{
                cy.visit(APP_URL);
                cy.get('#content').find('h4').then((b)=>{
                    const subHeaderText = b.text();
                    const expectedText = 'This is where you can log into the secure area. Enter tomsmith for the username and SuperSecretPassword! for the password. If the information is wrong you should see error messages.';
                    cy.expect(subHeaderText).to.contains(expectedText);
                })
            });
        
            it('should have a submit button visible to perfrom the Login action on click',()=>{
                cy.visit(APP_URL);
                cy.get('button')
                    .should('be.visible')
                    .invoke('attr', 'type')
                    .should('equal', 'submit')
            });
        
            it('should check that there is a text field to enter the username',()=>{
                cy.visit(APP_URL);
                cy.contains('label', 'Username')
                    .invoke('attr', 'for')
                    .should('equal', 'username')
                cy.get('#username').should('be.visible');
            });
        
            it ('should check that there is a text field to enter the password',()=>{
                cy.visit(APP_URL);
                cy.contains('label','Password')
                    .invoke('attr','for')
                    .should('equal', 'password');
                cy.get('#password').should('be.visible');
            });
        
            it('should check the footer is visible',() =>{
                cy.visit(APP_URL);
                cy.get("#page-footer").find('div').find('div').then((a)=> {
                    const footer =a.text();
                    const expectedText = 'Powered by Elemental Selenium';
                    cy.expect(footer).to.equal(expectedText);
                });
            })
        
            it('should check the footer contains a link to the elemental selenium page',()=>{
                cy.visit(APP_URL);
                cy.contains('a','Elemental Selenium')
                    .should('have.attr', 'href', 'http://elementalselenium.com/');
            });
        
            it('should display Fork me on Github image',()=>{
                cy.visit(APP_URL);
                cy.get('img').should('be.visible');
            });
        }); 
       
        context('Successful Login', () => {
            it('should login to the app successfully if the user enters valid credentials', () => {
                cy.visit(APP_URL);
                cy.get('#username').type(VALID_USERNAME);
                cy.get('#password').type(VALID_PASSWORD);
                cy.get('form').submit();
                cy.wait(1500);
                cy.get('#flash').then(function(e){
                    const innerText = e.text()
                    const expectedText =  'You logged into a secure area!'
                    expect(innerText).to.contains(expectedText)
                 });
            });
        });
    
        context('Logout', () => {
            it('should have the option to logout on doing a sucessful login', () => {
                cy.visit(APP_URL);
                cy.get('#username').type(VALID_USERNAME);
                cy.get('#password').type(VALID_PASSWORD);
                cy.get('form').submit();
                cy.wait(500);
                cy.get('#content').find('a')
                    .should('have.attr', 'href', '/logout')
                    .click();
            });
        
            it('should logout of the app successfully on clicking the logout button', () => {
                cy.visit(APP_URL);
                cy.get('#username').type(VALID_USERNAME);
                cy.get('#password').type(VALID_PASSWORD);
                cy.get('form').submit();
                cy.wait(500);
                cy.get('#content').find('a')
                    .click();
                cy.get('#flash').then(function(e){
                    const innerText = e.text();
                    const expectedText =  'You logged out of the secure area!';
                    expect(innerText).to.contains(expectedText)
                });
            });
        });      
    });      
});