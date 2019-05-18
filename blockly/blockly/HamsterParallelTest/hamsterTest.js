
    function{
        var params = {
            array: [1, 2, 3, 4];
            threads: 4
        };

        hamsters.run(params, function() {
          for(var i = 0; i < params.array; i++) {
            rtn.data.push(params.array[i] * 4);
          }
        }, function(results) {

        });
    }