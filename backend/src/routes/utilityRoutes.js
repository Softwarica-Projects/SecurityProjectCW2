const express = require('express');
const MovieTypes = require('../enums/movieEnums');
const Roles = require('../enums/roles.enum');
const Movie = require('../models/movieModel');
const Genre = require('../models/genreModel');

const router = express.Router();

router.get('/movie-types', (req, res) => {
  res.status(200).json(Object.values(MovieTypes));
});

router.get('/roles', (req, res) => {
  res.status(200).json(Object.values(Roles));
});

router.post('/seed-movies', async (req, res) => {
  try {
    const genres = await Genre.find();

    const genreMap = {};
    genres.forEach(genre => {
      genreMap[genre.name] = genre._id;
    });

    if (genres.length === 0) {
      return res.status(400).json({
        message: 'No genres found in the database. Please add genres first.'
      });
    }

    const sampleMovies = [
      {
        title: "Ballerina",
        description: "Assassin ballerina seeks vengeance in John Wick universe.",
        releaseDate: new Date("2025-06-06"),
        genre: genreMap.Action || genres[0]._id,
        cast: [
          { name: "Ana de Armas", type: "Actor" },
          { name: "Gabriel Byrne", type: "Actor" },
          { name: "Norman Reedus", type: "Actor" }
        ],
        runtime: 125,
        movieType: "movie",
        featured: true,
        trailerLink: "https://www.youtube.com/watch?v=0FSwsrFpkbw&ab_channel=LionsgateMovies",
        coverImage: "/uploads/Ballerina.jpeg"
      },
      {
        title: "Sky Force",
        description: "Military drama about India's 1965 airstrike.",
        releaseDate: new Date("2025-01-24"),
        genre: genreMap.Adventure || genres[0]._id,
        cast: [
          { name: "Akshay Kumar", type: "Actor" },
          { name: "Sara Ali Khan", type: "Actor" },
          { name: "Veer Pahariya", type: "Actor" }
        ],
        runtime: 125,
        movieType: "movie",
        featured: true,
        trailerLink: "https://youtu.be/PKsVB1wPZ78?si=QGp7KuElv_qsXr-J",
        coverImage: "/uploads/Sky_Force.jpeg"
      },
      {
        title: "The Naked Gun (Reboot)",
        description: "Frank Drebin Jr. starring Liam Neeson in slapstick reboot.",
        releaseDate: new Date("2025-08-01"),
        genre: genreMap.Comedy || genres[0]._id,
        cast: [
          { name: "Liam Neeson", type: "Actor" },
          { name: "Pamela Anderson", type: "Actor" },
          { name: "Paul Walter Hauser", type: "Actor" }
        ],
        runtime: 100,
        movieType: "movie",
        featured: false,
        trailerLink: "https://youtu.be/uLguU7WLreA?si=2NPjlIl5rWmwmHxU",
        coverImage: "/uploads/The_Naked_Gun_Reboot.jpeg"
      },
      {
        title: "Springsteen: Deliver Me From Nowhere",
        description: "Bruce Springsteen biopic focused on Nebraska era.",
        releaseDate: new Date("2025-10-24"),
        genre: genreMap.Drama || genres[0]._id,
        cast: [
          { name: "Jeremy Allen White", type: "Actor" },
          { name: "Jeremy Strong", type: "Actor" },
          { name: "Odessa Young", type: "Actor" }
        ],
        runtime: 130,
        movieType: "movie",
        featured: true,
        trailerLink: "https://youtu.be/oQXdM3J33No?si=CAE2MlbhbUYvSroq",
        coverImage: "/uploads/Springsteen_Deliver_me_from_nowhere.jpeg"
      },
      {
        title: "Fantastic Four: First Steps",
        description: "Origin story of Marvel's First Family.",
        releaseDate: new Date("2025-07-25"),
        genre: genreMap.Fantasy || genres[0]._id,
        cast: [
          { name: "Sue Storm", type: "Actor" },
          { name: "Reed Richards", type: "Actor" },
          { name: "Johnny Storm", type: "Actor" }
        ],
        runtime: 120,
        movieType: "movie",
        featured: false,
        trailerLink: "https://youtu.be/pAsmrKyMqaA?si=NECxsdaAc0RU9fUa",
        coverImage: "/uploads/Fantastic_Four_First_Steps.jpeg"
      },
      {
        title: "M3GAN 2.0",
        description: "Sequel to the killer AI doll horror hit.",
        releaseDate: new Date("2025-06-27"),
        genre: genreMap.Horror || genres[0]._id,
        cast: [
          { name: "Allison Williams", type: "Actor" },
          { name: "Violet McGraw", type: "Actor" },
          { name: "Jenna Davis", type: "Voice" }
        ],
        runtime: 100,
        movieType: "movie",
        featured: true,
        trailerLink: "https://youtu.be/IYLHdEzsk1s?si=mijOfqsb-Wr2NGpG",
        coverImage: "/uploads/M3GAN_2.jpeg"
      },
      {
        title: "La La Land",
        description: "Jazz-loving couple pursues dreams in L.A.",
        releaseDate: new Date("2016-12-09"),
        genre: genreMap.Romance || genres[0]._id,
        cast: [
          { name: "Ryan Gosling", type: "Actor" },
          { name: "Emma Stone", type: "Actor" },
          { name: "John Legend", type: "Actor" }
        ],
        runtime: 128,
        movieType: "movie",
        featured: false,
        trailerLink: "https://youtu.be/0pdqf4P9MB8?si=aGAHAYttB8TFoZik",
        coverImage: "/uploads/La_La_Land.jpeg"
      },
      {
        title: "Nobu",
        description: "Chef Nobu's journey from humble beginnings to global icon.",
        releaseDate: new Date("2025-07-02"),
        genre: genreMap.Documentary || genres[0]._id,
        cast: [
          { name: "Nobuyuki Matsuhisa", type: "Self" },
          { name: "Robert De Niro", type: "Self" },
          { name: "Oprah Winfrey", type: "Self" }
        ],
        runtime: 120,
        movieType: "movie",
        featured: false,
        trailerLink: "https://youtu.be/i4ak4UdmFU0?si=IfkHGHDtyBI5QfkR",
        coverImage: "/uploads/Nobu.jpeg"
      },
      {
        title: "Guardians of the Galaxy Vol. 3",
        description: "The Guardians face new cosmic threats and personal challenges.",
        releaseDate: new Date("2023-05-05"),
        genre: genreMap.Action || genres[0]._id,
        cast: [
          { name: "Chris Pratt", type: "Actor" },
          { name: "Zoe Saldana", type: "Actor" },
          { name: "Dave Bautista", type: "Actor" }
        ],
        runtime: 150,
        movieType: "movie",
        featured: true,
        trailerLink: "https://youtu.be/u3V5KDHRQvk?si=DFCWcObS4jF6Mw_T",
        coverImage: "/uploads/Guardians_of_the_Galaxy_Vol_3.jpeg"
      },
      {
        title: "Oppenheimer",
        description: "The story of J. Robert Oppenheimer and the atomic bomb.",
        releaseDate: new Date("2023-07-21"),
        genre: genreMap.Drama || genres[0]._id,
        cast: [
          { name: "Cillian Murphy", type: "Actor" },
          { name: "Emily Blunt", type: "Actor" },
          { name: "Matt Damon", type: "Actor" }
        ],
        runtime: 180,
        movieType: "movie",
        featured: true,
        trailerLink: "https://youtu.be/uYPbbksJxIg?si=71eyo_PmHn0za_Jj",
        coverImage: "/uploads/Oppenheimer.jpeg"
      },
      {
        title: "Barbie",
        description: "Barbie and Ken go on a journey of self-discovery.",
        releaseDate: new Date("2023-07-21"),
        genre: genreMap.Comedy || genres[0]._id,
        cast: [
          { name: "Margot Robbie", type: "Actor" },
          { name: "Ryan Gosling", type: "Actor" },
          { name: "Will Ferrell", type: "Actor" }
        ],
        runtime: 114,
        movieType: "movie",
        featured: false,
        trailerLink: "https://youtu.be/pBk4NYhWNMM?si=IEnqhj1bVujOIeRj",
        coverImage: "/uploads/Barbie.jpeg"
      },
      {
        title: "Spider-Man: Across the Spider-Verse",
        description: "Miles Morales travels across the Multiverse.",
        releaseDate: new Date("2023-06-02"),
        genre: genreMap.Fantasy || genres[0]._id,
        cast: [
          { name: "Shameik Moore", type: "Voice" },
          { name: "Hailee Steinfeld", type: "Voice" },
          { name: "Oscar Isaac", type: "Voice" }
        ],
        runtime: 140,
        movieType: "movie",
        featured: true,
        trailerLink: "https://youtu.be/cqGjhVJWtEg?si=LiPh7mjWX3Wxkv6d",
        coverImage: "/uploads/Spider_Man_Across_the_Spider_Verse.jpeg"
      },
      {
        title: "John Wick: Chapter 4",
        description: "John Wick uncovers a path to defeating The High Table.",
        releaseDate: new Date("2023-03-24"),
        genre: genreMap.Action || genres[0]._id,
        cast: [
          { name: "Keanu Reeves", type: "Actor" },
          { name: "Donnie Yen", type: "Actor" },
          { name: "Bill Skarsgård", type: "Actor" }
        ],
        runtime: 169,
        movieType: "movie",
        featured: true,
        trailerLink: "https://youtu.be/qEVUtrk8_B4?si=h-JxKxUdbLwIo-tu",
        coverImage: "/uploads/John_Wick_Chapter_4.jpeg"
      },
      {
        title: "Elemental",
        description: "A city where fire, water, land, and air residents live together.",
        releaseDate: new Date("2023-06-16"),
        genre: genreMap.Fantasy || genres[0]._id,
        cast: [
          { name: "Leah Lewis", type: "Voice" },
          { name: "Mamoudou Athie", type: "Voice" },
          { name: "Ronnie del Carmen", type: "Voice" }
        ],
        runtime: 102,
        movieType: "movie",
        featured: false,
        trailerLink: "https://youtu.be/hXzcyx9V0xw?si=57meNVBBlnfPQmL1",
        coverImage: "/uploads/Elemental.jpeg"
      },
      {
        title: "The Marvels",
        description: "Carol Danvers teams up with Kamala Khan and Monica Rambeau.",
        releaseDate: new Date("2023-11-10"),
        genre: genreMap.Adventure || genres[0]._id,
        cast: [
          { name: "Brie Larson", type: "Actor" },
          { name: "Iman Vellani", type: "Actor" },
          { name: "Teyonah Parris", type: "Actor" }
        ],
        runtime: 105,
        movieType: "movie",
        featured: false,
        trailerLink: "https://youtu.be/wS_qbDztgVY?si=1m5GQ27rtc3FZa6P",
        coverImage: "/uploads/The_Marvels.jpeg"
      },
      {
        title: "Mission: Impossible – Dead Reckoning Part One",
        description: "Ethan Hunt and his IMF team face a new global threat.",
        releaseDate: new Date("2023-07-12"),
        genre: genreMap.Action || genres[0]._id,
        cast: [
          { name: "Tom Cruise", type: "Actor" },
          { name: "Hayley Atwell", type: "Actor" },
          { name: "Ving Rhames", type: "Actor" }
        ],
        runtime: 163,
        movieType: "movie",
        featured: true,
        trailerLink: "https://youtu.be/3NawzlSevKg?si=Wl8VkSXkJge6_nTK",
        coverImage: "/uploads/Mission_Impossible_Dead_Reckoning_Part_one.jpeg"
      },
      {
        title: "Past Lives",
        description: "Two deeply connected childhood friends reunite after decades.",
        releaseDate: new Date("2023-06-02"),
        genre: genreMap.Romance || genres[0]._id,
        cast: [
          { name: "Greta Lee", type: "Actor" },
          { name: "Teo Yoo", type: "Actor" },
          { name: "John Magaro", type: "Actor" }
        ],
        runtime: 106,
        movieType: "movie",
        featured: false,
        trailerLink: "https://youtu.be/kA244xewjcI?si=A0H02CvZz-Umampw",
        coverImage: "/uploads/Past_Lives.jpeg"
      },
      {
        title: "Killers of the Flower Moon",
        description: "A series of murders in 1920s Oklahoma.",
        releaseDate: new Date("2023-10-20"),
        genre: genreMap.Drama || genres[0]._id,
        cast: [
          { name: "Leonardo DiCaprio", type: "Actor" },
          { name: "Robert De Niro", type: "Actor" },
          { name: "Lily Gladstone", type: "Actor" }
        ],
        runtime: 206,
        movieType: "movie",
        featured: true,
        trailerLink: "https://youtu.be/EP34Yoxs3FQ?si=6zeeXvjvZ85XRBKn",
        coverImage: "/uploads/Killers_of_the_Flower_Moon.jpeg"
      },
      {
        title: "The Super Mario Bros. Movie",
        description: "Mario and Luigi journey through the Mushroom Kingdom.",
        releaseDate: new Date("2023-04-05"),
        genre: genreMap.Comedy || genres[0]._id,
        cast: [
          { name: "Chris Pratt", type: "Voice" },
          { name: "Anya Taylor-Joy", type: "Voice" },
          { name: "Charlie Day", type: "Voice" }
        ],
        runtime: 92,
        movieType: "movie",
        featured: false,
        trailerLink: "https://youtu.be/TnGl01FkMMo?si=SbsdPO5rggVB6sOF",
        coverImage: "/uploads/The_Super_Mario_Bros_Movie.jpeg"
      },
      {
        title: "Creed III",
        description: "Adonis Creed faces a new rival from his past.",
        releaseDate: new Date("2023-03-03"),
        genre: genreMap.Drama || genres[0]._id,
        cast: [
          { name: "Michael B. Jordan", type: "Actor" },
          { name: "Tessa Thompson", type: "Actor" },
          { name: "Jonathan Majors", type: "Actor" }
        ],
        runtime: 116,
        movieType: "movie",
        featured: false,
        trailerLink: "https://youtu.be/AHmCH7iB_IM?si=AyOpaGIUaKSvHPE2",
        coverImage: "/uploads/Creed_III.jpeg"
      },
      {
        title: "The Whale",
        description: "A reclusive English teacher attempts to reconnect with his daughter.",
        releaseDate: new Date("2022-12-09"),
        genre: genreMap.Drama || genres[0]._id,
        cast: [
          { name: "Brendan Fraser", type: "Actor" },
          { name: "Sadie Sink", type: "Actor" },
          { name: "Hong Chau", type: "Actor" }
        ],
        runtime: 117,
        movieType: "movie",
        featured: false,
        trailerLink: "https://youtu.be/nWiQodhMvz4?si=JT4SP_D-y1tqKQKC",
        coverImage: "/uploads/The_Whale.jpeg"
      },
      {
        title: "Avatar: The Way of Water",
        description: "Jake Sully and Ney'tiri form a family on Pandora.",
        releaseDate: new Date("2022-12-16"),
        genre: genreMap.Adventure || genres[0]._id,
        cast: [
          { name: "Sam Worthington", type: "Actor" },
          { name: "Zoe Saldana", type: "Actor" },
          { name: "Sigourney Weaver", type: "Actor" }
        ],
        runtime: 192,
        movieType: "movie",
        featured: true,
        trailerLink: "https://youtu.be/d9MyW72ELq0?si=1XgB9cZ7xhkN0WTY",
        coverImage: "/uploads/Avatar_The_Way_of_Water.jpeg"
      },
      {
        title: "The Fabelmans",
        description: "A young man discovers a family secret and the power of movies.",
        releaseDate: new Date("2022-11-23"),
        genre: genreMap.Drama || genres[0]._id,
        cast: [
          { name: "Gabriel LaBelle", type: "Actor" },
          { name: "Michelle Williams", type: "Actor" },
          { name: "Paul Dano", type: "Actor" }
        ],
        runtime: 151,
        movieType: "movie",
        featured: false,
        trailerLink: "https://youtu.be/D1G2iLSzOe8?si=E5DuN2OBrhEFvrY9",
        coverImage: "/uploads/The_Fabelmans.jpeg"
      },
      {
        title: "Black Panther: Wakanda Forever",
        description: "The people of Wakanda fight to protect their home.",
        releaseDate: new Date("2022-11-11"),
        genre: genreMap.Action || genres[0]._id,
        cast: [
          { name: "Letitia Wright", type: "Actor" },
          { name: "Lupita Nyong'o", type: "Actor" },
          { name: "Danai Gurira", type: "Actor" }
        ],
        runtime: 161,
        movieType: "movie",
        featured: true,
        trailerLink: "https://youtu.be/_Z3QKkl1WyM?si=sIVW4g1NgK7pSkpH",
        coverImage: "/uploads/Black_Panther_Wakanda_Forever.jpeg"
      },
      {
        title: "Dune: Part Two",
        description: "Paul Atreides unites with the Fremen to seek revenge against the conspirators.",
        releaseDate: new Date("2024-03-01"),
        genre: genreMap.Adventure || genres[0]._id,
        cast: [
          { name: "Timothée Chalamet", type: "Actor" },
          { name: "Zendaya", type: "Actor" },
          { name: "Rebecca Ferguson", type: "Actor" }
        ],
        runtime: 166,
        movieType: "movie",
        featured: true,
        trailerLink: "https://youtu.be/Way9Dexny3w?si=HcnJfwfv3v4TyAOy",
        coverImage: "/uploads/Dune_Part_Two.jpeg"
      }
    ];
let remainingCount = sampleMovies.length;
    for (let i = 0; i < remainingCount; i++) {
      const baseMovie = sampleMovies[i % sampleMovies.length];
      remainingCount--;
      sampleMovies.push({
        ...baseMovie,
        title: `${baseMovie.title} (Remake ${i + 1})`,
        releaseDate: new Date(baseMovie.releaseDate.getTime() + (i * 30 * 24 * 60 * 60 * 1000)),
        featured: i % 3 === 0,
        views: Math.floor(Math.random() * 1000),
        averageRating: Math.floor(Math.random() * 5) + 1,
      });
    }

    await Movie.deleteMany({});
    await Movie.insertMany(sampleMovies);

    res.status(201).json({
      message: 'Movie database seeded successfully',
      count: sampleMovies.length
    });
  } catch (error) {
    console.error('Error seeding movies:', error);
    res.status(500).json({
      message: 'Failed to seed movie database',
      error: error.message
    });
  }
});

module.exports = router;