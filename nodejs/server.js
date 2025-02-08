const net = require("net"); // Модуль для работы с сокетами
const express = require("express"); // Фреймворк для создания веб-сервера
const path = require("path"); // Модуль для работы с путями файловой системы


const app = express(); // Создаем экземпляр приложения Express


// Настройка статической папки для отдачи файлов (например, HTML, CSS, JS)
app.use(express.static("public"));


// Позволяем парсить данные, переданные через формы
app.use(express.urlencoded({ extended: true }));


// Главная страница с формой
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html")); // Отправляем HTML файл на клиент
});


// Обработка отправки данных на печать
app.post("/send", async (req, res) => {
  const printerIP = req.body.printer_ip; // Получаем IP-адрес принтера из формы
  const printData = req.body.print_data; // Получаем данные для печати из формы

  // Проверяем, что введены IP-адрес принтера и данные для печати
  if (!printerIP || !printData) {
    return res.send(
      '<p style="color: red;">Invalid printer IP or empty print data.</p>'
    );
  }

  try {
    // Создаем сокет для соединения с принтером
    const client = new net.Socket();

    // Устанавливаем соединение с принтером (порт 9100 используется для печати)
    client.connect(9100, printerIP, () => {
      client.write(printData); // Отправляем данные на печать
      client.end(); // Закрываем соединение после отправки
      res.send('<p style="color: green;">Print command sent successfully.</p>'); // Уведомляем пользователя об успешной отправке
    });

    // Обработка ошибок соединения
    client.on("error", (err) => {
      console.error("Connection error:", err.message); // Логируем ошибку на сервере
      res.send(
        `<p style="color: red;">Unable to connect to printer: ${err.message}</p>`
      ); // Возвращаем ошибку на клиент
    });
  } catch (error) {
    console.error("Error:", error.message); // Логируем общие ошибки
    res.send(`<p style="color: red;">Error: ${error.message}</p>`); // Возвращаем ошибку на клиент
  }
});


// Запуск веб-сервера на порту 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`); // Уведомляем в консоли, что сервер запущен
});


// Example of ZPL code
/*const zpl_example = `
                        ^XA

                        ^FX Top section with logo, name and address.
                        ^CF0,60
                        ^FO50,50^GB100,100,100^FS
                        ^FO75,75^FR^GB100,100,100^FS
                        ^FO93,93^GB40,40,40^FS
                        ^FO220,50^FDIntershipping, Inc.^FS
                        ^CF0,30
                        ^FO220,115^FD1000 Shipping Lane^FS
                        ^FO220,155^FDShelbyville TN 38102^FS
                        ^FO220,195^FDUnited States (USA)^FS
                        ^FO50,250^GB700,3,3^FS

                        ^FX Second section with recipient address and permit information.
                        ^CFA,30
                        ^FO50,300^FDJohn Doe^FS
                        ^FO50,340^FD100 Main Street^FS
                        ^FO50,380^FDSpringfield TN 39021^FS
                        ^FO50,420^FDUnited States (USA)^FS
                        ^CFA,15
                        ^FO600,300^GB150,150,3^FS
                        ^FO638,340^FDPermit^FS
                        ^FO638,390^FD123456^FS
                        ^FO50,500^GB700,3,3^FS

                        ^FX Third section with bar code.
                        ^BY5,2,270
                        ^FO100,550^BC^FD12345678^FS

                        ^FX Fourth section (the two boxes on the bottom).
                        ^FO50,900^GB700,250,3^FS
                        ^FO400,900^GB3,250,3^FS
                        ^CF0,40
                        ^FO100,960^FDCtr. X34B-1^FS
                        ^FO100,1010^FDREF1 F00B47^FS
                        ^FO100,1060^FDREF2 BL4H8^FS
                        ^CF0,190
                        ^FO470,955^FDCA^FS

                        ^XZ
                        `
*/