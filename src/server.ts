import fastify from "fastify";
import { PrismaClient } from "@prisma/client";
import { create, Whatsapp } from 'venom-bot';
import fastifyCors from "@fastify/cors";
import fastifyFormbody from "@fastify/formbody";

const prisma = new PrismaClient();
const app = fastify();

app.register(fastifyFormbody);

app.register(fastifyCors, {
  origin: "http://localhost:3000",
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})


let cliente: Whatsapp;



create({ session: "apizap", headless: false }) 
  .then((whatsappClient: Whatsapp) => {
    cliente = whatsappClient;
    console.log("Sessão do Venom Bot iniciada");
  })
  .catch((erro) => {
    console.error("Erro ao iniciar a sessão do Venom Bot:", erro);
  });

app.post("/cardapio", async (req, res) => {
  const { morning, lunch, afternoon } = req.body as {
    morning: string;
    lunch: string;
    afternoon: string;
  };

  try {
    const cardapio = await prisma.cardapio.create({
      data: {
        morning,
        lunch,
        afternoon,
      },
    });

    
    const mensagem = `📢 *Aviso Importante*\n\nOlá, queridos alunos!\n\nAqui está o cardápio de hoje:\n\n🍽️ *Manhã:*\n${morning}\n\n🍽️ *Almoço:*\n${lunch}\n\n🍽️ *Tarde:*\n${afternoon}\n\nAproveitem as refeições e tenham um ótimo dia! 😊\n\nAtenciosamente,\nEEEP MANUEL ABDIAS EVANGELISTA`;
    const idGrupo = "5588997996851@c.us"; 

    if (cliente) {
      cliente.sendText(idGrupo, mensagem)
        .then((resultado) => {
          console.log("Mensagem enviada para o grupo do WhatsApp:", resultado);
        })
        .catch((erro) => {
          console.error("Erro ao enviar mensagem para o grupo do WhatsApp:", erro);
        });
    }

    return res.status(201).send({message : "Cardápio criado com sucesso"});
  } catch (erro) {
    console.error("Erro ao criar cardápio:", erro);
    return res.status(500).send({ erro: "Erro interno do servidor" });
  }
});

app.listen({ port: 3000}).then(() => {
  console.log("Servidor rodando na porta 3000");
});
