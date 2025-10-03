<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Komentari i Sugestije</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { color: #333; margin-bottom: 5px; }
        .header p { color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .comment { max-width: 300px; word-wrap: break-word; }
        .total { margin-top: 20px; font-weight: bold; }
        .date { color: #666; font-size: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Komentari i Sugestije</h1>
        <p>Lista svih komentara i sugestija korisnika</p>
        <p class="date">Izveštaj kreiran: {{ $date }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Email</th>
                <th>Komentar</th>
                <th>Datum</th>
            </tr>
        </thead>
        <tbody>
            @foreach($suggestions as $index => $suggestion)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $suggestion->email ?? 'N/A' }}</td>
                <td class="comment">{{ $suggestion->comment }}</td>
                <td>{{ $suggestion->created_at->format('d.m.Y. H:i') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total">
        Ukupno komentara: {{ $total }}
    </div>
</body>
</html>
