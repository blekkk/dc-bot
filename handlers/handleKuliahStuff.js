const deleteTugasCheck = (client, queryParams, pool) => {
    pool.query(`SELECT * FROM public."List_Tugas"
  ORDER BY id ASC `, (err, res) => {
        if (err) throw err;
        if (res.rows.length === 0) {
            client.channel.send('Tidak ada tugas untuk didelete');
            return;
        }
        if (queryParams > res.rows.length) {
            client.react('❎');
            return;
        } else {
            client.react('✅');
        }
    });
}

module.exports = {
    handleAddTugas: (client, params, pool) => {
        let queryArr = [];
        params.replace(/(?<=")\s+(?=")/g, '').match(/[^\".+\"]+/g).forEach((elem) => {
            queryArr.push(elem.replace(/"/g, "'"))
        });
        if (queryArr.length !== 3) {
            client.channel.send('Wrong input!');
            return;
        }
        pool.query(`INSERT INTO public."List_Tugas"(mata_kuliah,detail_tugas,deadline_tugas)
      VALUES('${queryArr[0]}','${queryArr[1]}','${queryArr[2]}')`, (err, res) => {
            if (err) throw err;
            client.react('✅');
        });
    },
    
    handleListTugas: (client, params, pool) => {
        if (params.length !== 0) {
            client.channel.send('No params needed!');
            return;
        }
        let finalText = "";
        finalText = finalText.concat(`List Tugas:\n\n`);
        pool.query(`SELECT * FROM public."List_Tugas"
      ORDER BY id ASC `, (err, res) => {
            let i = 1;
            if (err || res.rows.length === 0) {
                console.log(err);
                client.channel.send('Tidak ada tugas');
                return;
            }
            for (let row of res.rows) {
                finalText = finalText.concat(`**No ${i}.**\n**Nama MK**: ${row.mata_kuliah}\n**Detail Tugas**: ${row.detail_tugas}\n**Deadline Tugas**: ${row.deadline_tugas}\n\n`);
                i++;
            }
            client.channel.send(finalText);
        });
    },
    
    handleDeleteTugas: (client, params, pool) => {
        let queryParams = 0;
        queryParams = parseInt(params);
        if (Number.isInteger(queryParams) === false) {
            client.channel.send('Wrong input!');
            return;
        }
        deleteTugasCheck(client, queryParams, pool);
        pool.query(`do $$
      <<delete_bangsat>>
      declare
          row_pointer integer;
      begin
          SELECT id into row_pointer
          FROM (
            SELECT
              ROW_NUMBER() OVER (ORDER BY id ASC) AS rownumber,
              id
            FROM public."List_Tugas"
          ) AS foo
          WHERE rownumber = ${queryParams};
          DELETE FROM public."List_Tugas"
          WHERE id = row_pointer;
      end delete_bangsat $$;`, (err, res) => {
            if (err) throw err;
        });
    },
    
    handleJadwalKuliah: (client, params, pool) => {
        let dayToday = "null";
        let dayOfWeek = ['mon', 'tue', 'wed', 'thu', 'fri'];
        let finalText = "";
        if (params.split(" ").length > 1) {
          client.channel.send("Please input just **one** day of the week!");
          return;
        }
        if (params.length === 0) {
          let date = new Date();
          dayToday = date.getDay();
          if (dayToday > 5 || dayToday < 1) {
              client.channel.send('Today is a weekend!');
              return;
          }
        }
        if (params.match(/^mon|tue|wed|thu|fri$/g) && dayToday === "null") {
          params = params.replace(/"/g, "'");
          finalText = finalText.concat(`Jadwal kuliah hari **${params}**:\n\n`);
          pool.query(`SELECT nama_kuliah,hari_kuliah,dosen,waktu_kuliah FROM public."Jadwal_Kuliah" WHERE hari_kuliah = '${params}' ORDER BY id ASC `, (err, res) => {
            if (err) throw err;
            for (let row of res.rows) {
              finalText = finalText.concat(`**Nama MK**: ${row.nama_kuliah}\n**Dosen**: ${row.dosen}\n**Waktu Kuliah**: ${row.waktu_kuliah}\n\n`);
            }
            client.channel.send(finalText);
          })
        } else if (dayToday !== "null" && params.length === 0) {
          dayToday = dayOfWeek[dayToday - 1];
          dayToday = dayToday.replace(/"/g, "'");
          finalText = finalText.concat(`Jadwal kuliah hari ini(**${dayToday}**):\n\n`);
          pool.query(`SELECT nama_kuliah,hari_kuliah,dosen,waktu_kuliah FROM public."Jadwal_Kuliah" WHERE hari_kuliah = '${dayToday}' ORDER BY id ASC `, (err, res) => {
            if (err) throw err;
            for (let row of res.rows) {
              finalText = finalText.concat(`**Nama MK**: ${row.nama_kuliah}\n**Dosen**: ${row.dosen}\n**Waktu Kuliah**: ${row.waktu_kuliah}\n\n`);
            }
            client.channel.send(finalText);
          })
        } else {
          client.channel.send("Please input the correct day (mon - fri)");
          return;
        }
    }
}