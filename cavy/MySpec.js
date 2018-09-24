export default function MySpec(spec) {
    
  spec.describe('Login', function() {
      spec.it('works', async function() {
        await spec.fillIn('Login.username', 'tomv')
        await spec.fillIn('Login.password', '123456')
        await spec.press('Login.btnLogin');
      });
    });

  // spec.describe('Load Equipment', function() {
  //   spec.it('works', async function() {
  //     await spec.press('UCMain.btnLoadEquipment');
  //     await spec.pause(3000);
  //     await spec.fillIn('UCMain.customer', 'test')
  //   });
  // });

  spec.describe('Select Inspection', function() {
    spec.it('works', async function() {
      await spec.pause(3000);
      await spec.press('UCMain.EQTEST1.1.1');
      await spec.pause(3000);
    });
  });
}