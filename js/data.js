data_test = fetch('data.php'/*,{
  headers:{
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}*/)
  .then(response => {
      if (!response.ok){
        throw new Error('Network response was not ok');
    }else (console.log(response));
    return response.json();
  })
  .then(data => {
    // 'data' now contains the data sent from PHP as a JavaScript object
    console.log(data);
    // Access the data properties
    console.log(data.features);
  })
  .catch(error => {
    console.error("Fetch error:", error);
  });

  //console.log(data_test.data);