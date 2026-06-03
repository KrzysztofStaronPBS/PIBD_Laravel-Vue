<template>
    <div>
        <div>Home</div>
        <div>
            <button class="border-2 hover:bg-green-50 font-bold p-3 rounded" @click="playLuckyDay()">
                Lucky day?
            </button>
        </div>
    </div>
</template>

<script setup>
import { inject } from "vue";

const popupService = inject("popupService");

const prizes = ["GOLD 1kg", "NICE CAR", "A WHOLE LOT OF NOTHING"];

const playLuckyDay = async () => {
    prizes.sort(() => Math.random() - 0.5);

    const choice = await popupService(
        "Choose the right gate. It might change your life!",
        { gate1: "Gate nr 1", gate2: "Gate nr 2", gate3: "Gate nr 3" },
        "Pop-up Lottery in progress..."
    );

    let wonPrize = "";
    if (choice === "gate1") wonPrize = prizes[0];
    else if (choice === "gate2") wonPrize = prizes[1];
    else if (choice === "gate3") wonPrize = prizes[2];

    if (choice !== 'close') {
        await popupService(
            `You have what you've chosen!`,
            { close: "Thanks" },
            `Your prize: ${wonPrize}`
        );
    }
};
</script>
