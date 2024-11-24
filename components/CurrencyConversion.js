import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Picker } from '@react-native-picker/picker';

const CurrencyConversion = () => {
  const [amount, setAmount] = useState('');
  const [fromCurrency, setFromCurrency] = useState('PKR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [conversionRate, setConversionRate] = useState({});
  const [convertedAmount, setConvertedAmount] = useState('');
  const [currencies, setCurrencies] = useState([]);

  const API_KEY = 'dbc85403325399516d60ce79';
  const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`;

  useEffect(() => {
    fetchExchangeRates();
  }, [fromCurrency]);

  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();

      if (data.result !== 'success') {
        throw new Error('API response error');
      }

      setConversionRate(data.conversion_rates);
      setCurrencies(Object.keys(data.conversion_rates));
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    }
  };

  const handleConvert = () => {
    if (amount && fromCurrency && toCurrency && conversionRate[toCurrency]) {
      const converted = (parseFloat(amount) * conversionRate[toCurrency]);
      setConvertedAmount(converted);
    }
  };

  const handleClear = () => {
    setAmount('');
    setConvertedAmount('');
    setFromCurrency('PKR');
    setToCurrency('USD');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Currency Converter</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={(text) => setAmount(text)}
      />

      <Picker
        selectedValue={fromCurrency}
        onValueChange={(itemValue) => setFromCurrency(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="PKR" value="PKR" />
      </Picker>

      <Picker
        selectedValue={toCurrency}
        onValueChange={(itemValue) => setToCurrency(itemValue)}
        style={styles.picker}
      >
        {currencies.map((currency) => (
          <Picker.Item key={currency} label={currency} value={currency} />
        ))}
      </Picker>
      {convertedAmount ? (
        <Text style={styles.result}>
          {amount} {fromCurrency} = {convertedAmount} {toCurrency}
        </Text>
      ) : null}

        <View style={styles.buttonContainer}>
            <Button title="Convert" onPress={handleConvert} />
        </View>

      <Button title="Clear" onPress={handleClear} />

    </View>
  );
};

export default CurrencyConversion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    backgroundColor: 'black'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  result: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 10
  }
});
