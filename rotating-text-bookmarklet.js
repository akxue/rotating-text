javascript: (() => {
  console.log("MOUNTING BOOKMARKLET");

  const rotatingTextElements = document.getElementsByClassName(
    "text-5xl p-3 bg-gray-800 rounded-md text-center"
  );

  if (!rotatingTextElements.length) {
    return;
  }

  const element = rotatingTextElements[0];
  console.log("FOUND MAIN ELEMENT");

  function replaceSpicyWithDemo(text) {
    return text.replace(/s[^\s]{4}/gi, (match) => {
      const demoPattern = "demo".split("");

      return demoPattern
        .map((char, index) => {
          if (index >= match.length) return char;
          return /[@!#$%^&*]/i.test(match[index]) ? match[index] : char;
        })
        .join("");
    });
  }

  function handleCharacterData(record, observer) {
    const newValue = replaceSpicyWithDemo(record.target.nodeValue);
    if (newValue !== record.target.nodeValue) {
      observer.disconnect();
      record.target.nodeValue = newValue;
      observer.observe(record.target, observerOptions);
    }
  }

  function handleMutation(records, observer) {
    for (const record of records) {
      if (record.type === "characterData") {
        handleCharacterData(record, observer);
      }
    }
  }

  function swapSpicy(records, observer) {
    records.forEach((record) => {
      if (record.type === "characterData") {
        handleCharacterData(record, observer);
      } else {
        record.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const observer = new MutationObserver(handleMutation);
            if (node.shadowRoot) {
              observer.observe(node.shadowRoot, observerOptions);
            } else {
              observer.observe(node, observerOptions);
            }
          }
        });
      }
    });
  }

  const observerOptions = {
    characterData: true,
    childList: true,
    subtree: true,
  };

  const observer = new MutationObserver(swapSpicy);
  observer.observe(element, observerOptions);
})();
