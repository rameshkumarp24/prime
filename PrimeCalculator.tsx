import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';

const isPrimeNumber = (num: number): boolean => {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const getPrimeFactorization = (num: number, primeDivs: number[]): { base: number; power: number }[] => {
  const factors = [];
  let remaining = num;
  for (const prime of primeDivs) {
    let power = 0;
    while (remaining % prime === 0) {
      power++;
      remaining = remaining / prime;
    }
    if (power > 0) {
      factors.push({ base: prime, power });
    }
    if (remaining === 1) break;
  }
  return factors;
};

const PrimeCalculator = () => {
  const [number, setNumber] = useState<string>('');
  const [lastNumber, setLastNumber] = useState<number | null>(null);
  const [divisors, setDivisors] = useState<number[]>([]);
  const [primeDivisors, setPrimeDivisors] = useState<number[]>([]);
  const [primeFactorization, setPrimeFactorization] = useState<{ base: number; power: number }[]>([]);
  const [isPrime, setIsPrime] = useState<boolean | null>(null);

  const handleChange = (text: string) => {
    setNumber(text.replace(/[^0-9]/g, ''));
    setDivisors([]);
    setPrimeDivisors([]);
    setPrimeFactorization([]);
    setIsPrime(null);
  };

  const handleSubmit = () => {
    const num = parseInt(number, 10);
    if (!isNaN(num) && num > 0) {
      setLastNumber(num);
      const divs = new Set<number>();
      const primeDivs = new Set<number>();
      let prime = num > 1;
      for (let i = 1; i * i <= num; i++) {
        if (num % i === 0) {
          divs.add(i);
          divs.add(num / i);
          if (isPrimeNumber(i)) primeDivs.add(i);
          if (isPrimeNumber(num / i)) primeDivs.add(num / i);
          if (i !== 1 && i !== num) prime = false;
        }
      }
      const sortedDivs = Array.from(divs).sort((a: number, b: number) => a - b);
      const sortedPrimeDivs = Array.from(primeDivs).sort((a: number, b: number) => a - b);
      setDivisors(sortedDivs);
      setPrimeDivisors(sortedPrimeDivs);
      setPrimeFactorization(getPrimeFactorization(num, sortedPrimeDivs));
      setIsPrime(prime);
      setNumber('');
    } else {
      setDivisors([]);
      setPrimeDivisors([]);
      setPrimeFactorization([]);
      setIsPrime(null);
    }
  };

  const renderFactorization = () => {
    return primeFactorization.map((factor, index) => (
      <Text key={index} style={styles.inlineText}>
        {factor.base}
        {factor.power > 1 ? <Text style={styles.sup}>{factor.power}</Text> : null}
        {index < primeFactorization.length - 1 ? ' × ' : ''}
      </Text>
    ));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Prime Number Calculator</Text>
      <TextInput
        style={styles.input}
        value={number}
        onChangeText={handleChange}
        placeholder="Enter a number"
        keyboardType="numeric"
      />
      <Button title="Submit" onPress={handleSubmit} />
      {isPrime !== null && (
        <Text style={styles.result}>
          {isPrime
            ? `${lastNumber} is a Prime Number`
            : `${lastNumber} is NOT a Prime Number`}
        </Text>
      )}
      {divisors.length > 0 && (
        <View style={styles.resultBox}>
          {primeFactorization.length > 0 && (
            <Text style={styles.result}>Prime Factorization: {renderFactorization()}</Text>
          )}
          {primeDivisors.length > 0 && (
            <Text style={styles.result}>Prime Divisors: {primeDivisors.join(', ')}</Text>
          )}
          <Text style={styles.result}>Divisors: {divisors.join(', ')}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#61dafb',
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderWidth: 2,
    borderColor: '#61dafb',
    borderRadius: 5,
    width: 200,
    marginBottom: 10,
    textAlign: 'center',
  },
  result: {
    marginTop: 10,
    fontSize: 18,
    textAlign: 'left',
    marginHorizontal: 16,
  },
  resultBox: {
    marginTop: 10,
    width: '100%',
  },
  inlineText: {
    fontSize: 18,
    flexDirection: 'row',
  },
  sup: {
    fontSize: 12,
    lineHeight: 18,
    textAlignVertical: 'top',
  },
});

export default PrimeCalculator;
