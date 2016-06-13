<?php
$terms = get_field('super_footer_cats');

class PostsBy
{
    static function getWpPosts($terms, $count)
    {
        global $wpdb;

        $query = array(
            "cat" => $terms,
            "showposts" => $count,
            'orderby' => 'date',
            'order' => 'DESC'
        );

        //var_dump($query, $posts);

        $posts = query_posts($query);

        $result = array();

        foreach ($posts as $post) {
            $result[] = array(
                'id' => '',
                'post_id' => $post->ID,
                'title' => $post->post_title,
                'content' => $post->post_content,
                'excerpt' => $post->post_excerpt,
                'link' => $post->guid,
                'date' => date('F j, Y', strtotime($post->post_date)),
                'type' => $post->post_type
            );
        }

        return $result;
    }

}

if ($terms): ?>

    <section>
        <div class="container">
            <div class="row">
                <div class="col-sm-12">
                    <h1>Related information</h1>
                </div>
                <div class="col-sm-12">
                    <div id="related_posts" class="owl-carousel owl-theme">

                        <?php
                        $results = array();
                        $posts = PostsBy::getWpPosts($terms, -1);
                        $results = array_chunk ($posts , 6);
                        ?>

                        <?php $c = 0;
                        foreach ($results as $block_from_six_item) {
                            ?>
                            <div class="item item-<?php echo $c; ?>">

                                <?php foreach ($block_from_six_item as $item) { ?>
                                    <?php
                                    //var_dump($item) ;
                                    $link = $item['link'];
                                    $title = $item['title'];
                                    $excerpt = $item['excerpt'];
                                    $content = $item['content'];
                                    ?>
                                    <div class="col-sm-4">
                                        <h2><a href="<?php echo $item['link'];?>"><?php echo $item['title'] ?></a></h2>
                                        <?php if($excerpt){ ?>
                                            <p><?php echo $item['excerpt'] ?></p>
                                        <?php } else {?>
                                            <p><?php echo $item['content'] ?></p>
                                        <?php } ?>

                                    </div>
                                <?php } ?>

                            </div>
                            <?php $c++;
                        } ?>

                    </div>
                </div>
            </div>
        </div>
    </section>

<?php endif; ?>
