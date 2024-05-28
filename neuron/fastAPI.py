from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from datetime import date
import psycopg2
from typing import Optional
from pydantic import BaseModel
from trtr3 import neuron
import uvicorn


class ProjectID(BaseModel):
    year: int
    project: list = []
    programID: int
    groupID: int


app = FastAPI()

origins = ["http://localhost:3000"]  # вайт-лист

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST"],
    allow_headers=["*"]
)


@app.post("/")
async def root(pro: ProjectID):
    conn = {
        'dbname': 'tmaker_db1',
        'user': 'postgres',
        'password': 'spk3800',  # проверить пароль блять
        'host': 'localhost',
        'port': '5432'  # Или другой адрес сервера
    }

    print(pro.year, pro.programID, pro.groupID)

    def get_filtered_students(program_id, year, group):
        query = f"""
        WITH FilteredStudents AS (
            SELECT student_id, pseudo, average_score
            FROM public.student
            WHERE program_id = {program_id}
            AND EXTRACT(YEAR FROM student_year) = {year}
            AND student_group = '{group}'
        )
        SELECT
            fs.student_id,
            fs.pseudo,
            STRING_AGG(sk.skill_name, ', ') AS skills,
            STRING_AGG(CAST(sk.skill_id AS VARCHAR), ', ') AS skill_ids,
            fs.average_score
        FROM
            FilteredStudents fs
        JOIN
            public.student_skill ss ON fs.student_id = ss.student_id
        JOIN
            public.skill sk ON ss.skill_id = sk.skill_id
        GROUP BY
            fs.student_id, fs.pseudo, fs.average_score
        ORDER BY
            fs.student_id;
        """
        return query

    query = get_filtered_students(pro.programID, pro.year, pro.groupID)

    def fetch_data(conn_params, query):
        # Подключение к базе данных
        with psycopg2.connect(**conn_params) as conn:
            with conn.cursor() as cur:
                cur.execute(query)
                results = cur.fetchall()

        # Разделение данных
        student_ids = []
        pseudonyms = []
        skills = []
        skill_ids = []
        average_scores = []  # Массив для средних баллов

        for row in results:
            student_ids.append(row[0])
            pseudonyms.append(row[1])
            skills.append(row[2].split(', '))
            skill_ids.append(row[3].split(', '))
            average_scores.append(row[4])  # Извлекаем средний балл

        return student_ids, pseudonyms, skills, skill_ids, average_scores

    # Предположим, что conn_params уже определены
    # Получение данных
    student_ids, pseudonyms, student_skills, skill_ids, average_scores = fetch_data(
        conn, query)

    # Печать результатов для проверки
    # print("Student IDs:", student_ids)
    # print("Pseudonyms:", pseudonyms)
    # print("Skills:", skills)
    # print("Skill IDs:", skill_ids)
    # print("Average Scores:", average_scores)

    # Список ID проектов
    query = """
    SELECT
        p.project_id,
        p._name AS project_name,
        STRING_AGG(CAST(ps.skill_id AS VARCHAR), ', ') AS skill_ids,
        STRING_AGG(s.skill_name, ', ') AS skill_names
    FROM
        public.project p
    JOIN
        public.project_skill ps ON p.project_id = ps.project_id
    JOIN
        public.skill s ON ps.skill_id = s.skill_id
    WHERE
        p.project_id = ANY(%s)
    GROUP BY
        p.project_id, p._name
    ORDER BY
        p.project_id;
    """

    def fetch_and_process_project_skills(conn_params, query, project_ids):
        print("project_ids")
        print(project_ids)
        with psycopg2.connect(**conn_params) as conn:
            with conn.cursor() as cur:
                cur.execute(query, (project_ids,))
                results = cur.fetchall()

        project_ids = []
        project_names = []
        skills = []
        skill_ids = []

        for row in results:
            project_ids.append(row[0])
            project_names.append(row[1])
            skill_ids.append(row[2].split(', '))
            skills.append(row[3].split(', '))

        return project_ids, project_names, skill_ids, skills

    print(pro.project)
    # Получение и обработка данных
    project_ids, project_names, skill_ids, project_skills = fetch_and_process_project_skills(
        conn, query, pro.project)
    # Вывод результатов
    # print("Project IDs:", project_ids)
    # print("Project Names:", project_names)
    # print("Skill IDs:", skill_ids)
    # print("Skills:", skills)

    print(len(student_skills), len(project_skills),
          len(average_scores), len(student_ids))
    print("student_skills", student_skills)
    print("project_skills", project_skills)
    print("average_scores", average_scores)
    print("student_ids", student_ids)

    team_data = neuron(student_skills, project_skills,
                       average_scores, student_ids)

    def insert_teams_and_students(conn_params, team_data, project_ids):
        with psycopg2.connect(**conn_params) as conn:
            with conn.cursor() as cur:
                # Словарь для сохранения team_id, связанных с каждым project_id
                team_ids = {}

                # Вставка данных в таблицу team и получение созданных team_id
                for team_key, project_id in zip(team_data.keys(), project_ids):
                    cur.execute("""
                        INSERT INTO public.team (project_id) VALUES (%s) RETURNING team_id;
                        """, (project_id,))
                    team_id = cur.fetchone()[
                        0]  # Получение team_id из результатов запроса
                    # Сохранение team_id для использования при вставке в student_team
                    team_ids[team_key] = team_id

                # Вставка данных в таблицу student_team, используя полученные team_id
                for team_key, students in team_data.items():
                    for student_id in students:
                        cur.execute("""
                            INSERT INTO public.student_team (student_id, team_id) VALUES (%s, %s)
                            """, (student_id, team_ids[team_key]))

                # Фиксация транзакции
                conn.commit()

                # Возврат списка созданных team_id
                return list(team_ids.values())

    team_id = insert_teams_and_students(conn, team_data, pro.project)
    return team_id


uvicorn.run(app, port=8000)
