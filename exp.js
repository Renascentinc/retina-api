

async function waga() {
  throw Error('Waga throws!!!');
}

async function dude() {
  await waga();
}

(async () => {
  try {
    await dude()
  } catch (e) {
    console.log(e)
  } finally {

  }
})()
