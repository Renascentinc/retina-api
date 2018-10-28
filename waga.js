

function createToolSnapshotDiff(previousToolSnapshot, currentToolSnapshot) {
  let previousToolSnapshotDiff = {}

  for (let key in currentToolSnapshot) {
    if (previousToolSnapshot[key] !== currentToolSnapshot[key]) {
      previousToolSnapshotDiff[key] = previousToolSnapshot[key];
    }
  }

  return previousToolSnapshotDiff
}


x = createToolSnapshotDiff({
  status: "WAGA",
  blah: "II"
}, {
  status: "WAGA",
  blah: "DD"
})

console.log(x)
