<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Newsletter Subscribers</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .header h1 { color: #333; margin-bottom: 5px; }
        .header p { color: #666; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f8f9fa; font-weight: bold; }
        .total { margin-top: 20px; font-weight: bold; }
        .date { color: #666; font-size: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Newsletter Subscribers</h1>
        <p>Lista svih pretplatnika na newsletter</p>
        <p class="date">Izveštaj kreiran: {{ $date }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Email</th>
                <th>Datum prijave</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($subscribers as $index => $subscriber)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $subscriber->email }}</td>
                <td>{{ $subscriber->created_at->format('d.m.Y. H:i') }}</td>
                <td>{{ $subscriber->is_active ? 'Aktivan' : 'Neaktivan' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="total">
        Ukupno pretplatnika: {{ $total }}
    </div>
</body>
</html>
