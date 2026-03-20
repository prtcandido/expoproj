import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button, Text, TextInput, View } from "react-native";
import * as yup from "yup";

// INSTALAR: npx expo install react-hook-form yup @hookform/resolvers

// 1. Definindo o esquema de validação
const schema = yup
  .object({
    nome: yup
      .string()
      .required("O nome é obrigatório")
      .matches(
        /^[A-Za-zÀ-ÿ\s]+$/,
        "O nome deve conter apenas letras e espaços",
      ),
    preco: yup
      .string()
      .transform((value) => value.replace(",", ".")) // Troca vírgula por ponto (formatos BR)
      .test(
        "is-number",
        "Preço inválido",
        (value) => !isNaN(parseFloat(value as string)),
      )
      .required("O preço é obrigatório"),
  })
  .required();

export default function Produto() {
  const {
    // Configurando o React Hook Form com o resolver do Yup
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data: any) => console.log(data); // Escreve no console (terminal) os dados do formulário quando o botão "Salvar" for pressionado

  return (
    <View>
      {/* 2. Campo Nome */}
      <Controller
        control={control}
        name="nome"
        render={({ field: { onChange, value } }) => (
          <TextInput onChangeText={onChange} value={value} placeholder="Nome" />
        )}
      />
      {errors.nome && (
        <Text style={{ color: "red" }}>{errors.nome.message}</Text>
      )}

      {/* 3. Campo Preço */}
      <Controller
        control={control}
        name="preco"
        render={({ field: { onChange, value } }) => (
          <TextInput
            onChangeText={onChange}
            value={value ? value.toString() : ""}
            placeholder="Preço"
            keyboardType="numeric"
          />
        )}
      />
      {errors.preco && (
        <Text style={{ color: "red" }}>{errors.preco.message}</Text>
      )}

      <Button title="Salvar" onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
